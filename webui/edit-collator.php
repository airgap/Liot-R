<html>
  <head>
    <title>Liot R: Edit Collator</title>
    <?php include 'head.php'?>
    <script>
    var ID = '<?=$_GET['id']?>';
    var COMPARATORS = [
      "EQUALS",
      "NEQUALS",
      "TFNEQUALS",
      "OVER",
      "OVEROR",
      "UNDER",
      "UNDEROR",
    ]

    var OPERATORS = [
      "AND",
      "OR",
      "NAND",
      "NOR",
      "XOR",
      "SAME",
    ]

      var filterList;
      var reg = location.href.match(/after=(-?[0-9]+)/);
      var after = reg ? reg[1]*1 : 0;
      var filters = [];
      load(()=>{
        Lir.listFilters({}, res => {
          if(res.err) {
            console.log(res.err)
            return;
          }
          filters = res.filters;
          Lir.getCollators({ids:[ID]}, res => {
            if(res.err || !res.collators || !res.collators.length) {
              console.log(res.err);
              return;
            }
            console.log(res.collators[0])
            grab('item-id').innerHTML = '['+res.collators[0].id+']';
              grab('collator-name').value = res.collators[0].name||'';
            for(var filter of res.collators[0].filtrets)addFilter(filter.id)
            Lir.countCollatorReferences({ids:[ID]}, res => {
              if(res.err || !res.collators.length) {
                console.log(err || "No filter found.");
                return;
              }
              var cool = res.collators[0];
                grab('reference-count').innerHTML = "Used by " + cool.referrers.length + " distributors."
              console.log(cool.refcount);
              if(cool.refcount)addc('delete-button', 'disabled')
              if(cool.refcount)grab('delete-button').innerHTML = "Undeletable";
            })
          })
          //filters.push({id:filter.id,name:filter.name})
        })
      })
      function addFilter(id) {
        var select = document.createElement('select');
        for(var filter of filters) {
          var option = document.createElement('option');
          option.value = filter.id;
          option.innerHTML = filter.name;
          select.appendChild(option);
          console.log(id)
          if(id&&(filter.id==id))option.selected = true;
        }
        var rem = document.createElement('label');
        rem.innerHTML = '-';
        var item = document.createElement('div');
        item.appendChild(rem)
        item.appendChild(select)
        grab('filter-list').insertBefore(item, grab('add-filter'))
        bind(rem, 'click', k=>{
          item.parentNode.removeChild(item);
        })
      }
      function save() {
        //addc('save-button', 'disabled');
        err('Creating collator...');
        var name = grab('collator-name').value;
        var filtrets = [];
        var selects = document.getElementsByTagName('select');
        for(var i of selects)
          filtrets.push(i.value);
        Lir.addCollators({
          collators:[{
          name: name,
          filters: filtrets,
          id: ID
        }]}, res => {
          if(res.err) {
            console.log(res.err);
            return;
          }
          location.href = "/collators.php";
        })
      }
      function deletef() {
        if(confirm("Are you sure you wish to delete this filter? This action cannot be undone.")) {
          Lir.deleteCollators({ids:[ID]},res=>{
            location.href = 'filters.php';
          })
        }
      }
      function err(text) {
        grab('compile-errors').innerHTML = text||"Ready";
        setc('compile-errors', 'invalid-json', text)
        setc('save-button', 'disabled', text)
      }
      function xss(text) { return text.replace('<', '&lt') }
      function nelem(type) { return document.createElement(type) }
    </script>
  </head>
  <body>
    <div id="content">
      <?php include 'nav.php'?>
      <h1>Edit Collator</h1>
      <h2 id="item-id">[abcdefgh-ijkl-mnop-qrst-uvwxyz012345]</h2>
      <div class="bubbles new-box" id="filter-box">
        <div class="bubble max-bubble">
          <label for="collator-name">Name:</label>
          <input id="collator-name" placeholder="Unnamed Collator" type="text">
          <label>Filters:</label>
          <div class="bubble max-bubble" id="filter-list">
            <a onclick="addFilter()" id="add-filter">+ Filter</a>
          </div>
          <a id="save-button" onclick="save()" class="a-button">Save</a>
          <a id="delete-button" onclick="deletef()" class="a-button">Delete</a>
          <span id="reference-count">Ready</span>
        </div>
      </div>
    </div>
  </body>
</html>
