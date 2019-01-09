<html>
  <head>
    <title>Liot R: Edit Distributor</title>
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

      var collatorList;
      var reg = location.href.match(/after=(-?[0-9]+)/);
      var after = reg ? reg[1]*1 : 0;
      var collators = [];
      load(()=>{
        LiotR.listCollators({}, res => {
          if(res.err) {
            console.log(res.err)
            return;
          }
          collators = res.collators;
          LiotR.getDistributors({ids:[ID]}, res => {
            if(res.distributors && res.distributors.length) {
              var dist = res.distributors[0];
                console.log(dist);
              grab('distributor-name').value = dist.name || '';
              grab('distributor-push').checked = dist.push;
              grab('distributor-queue').checked = dist.queue;
              grab('distributor-callback').checked = dist.callback;
              grab('distributor-url').value = dist.url || '';
              grab('distributor-accessor').value = dist.accessor || '';
              grab('item-id').innerHTML = '['+dist.id+']';
              for(var collator of dist.collators)addCollator(collator.id)
            }
          })
          //for(var collator of res.collators)collators.push({id:collator.id,name:collator.name})
        })
      })
      function addCollator(id) {
        var select = document.createElement('select');
        for(var collator of collators) {
          var option = document.createElement('option');
          option.value = collator.id;
          option.innerHTML = collator.name || `[ ${collator.id} ]`;
          select.appendChild(option);
          if(id&&(collator.id==id))option.selected = true;
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
        err('Creating distributor...');
        var name = grab('distributor-name').value;
        var push = grab('distributor-push').checked;
        var queue = grab('distributor-queue').checked;
        var callback = grab('distributor-callback').checked;
        var url = grab('distributor-url').value;
        var accessor = grab('distributor-accessor').value;
        var filtrets = [];
        var selects = document.getElementsByTagName('select');
        for(var i of selects)
          filtrets.push(i.value);
        LiotR.addDistributors({
          distributors:[{
          name: name,
          push: push,
          queue: queue,
          callback: callback,
          url: url,
          accessor: accessor,
          collators: filtrets,
          id:ID
        }]}, res => {
          if(res.err) {
            console.log(res.err);
            return;
          }
          location.href = "/distributors.php";
        })
      }
      function deletef() {
        if(confirm("Are you sure you wish to delete this filter? This action cannot be undone.")) {
          LiotR.deleteDistributors({ids:[ID]},res=>{
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
      <h1>Edit Distributor</h1>
      <h2 id="item-id">[abcdefgh-ijkl-mnop-qrst-uvwxyz012345]</h2>
      <div class="bubbles new-box" id="collator-box">
        <div class="bubble max-bubble">
          <label for="distributor-name">Name:</label>
          <input id="distributor-name" placeholder="Unnamed Distributor" type="text">
            <label>Updates:</label>
            <input id="distributor-push" type="radio" checked name="distributor-type" value=true><label for="distributor-push">Push</label>
            <br>
            <input id="distributor-queue" type="checkbox" value=true class="l2-box"><label for="distributor-queue">Queue new updates</label>
            <br>
            <input id="distributor-callback" type="radio" name="distributor-type" value=true><label for="distributor-callback">Callback</label>
            <input id="distributor-url" type="text" value = "" placeholder="Callback URI" class="l2-box">
            <input id="distributor-accessor" type="text" value = "" placeholder="Accessor ID" class="l2-box">
          <label>Collators:</label>
          <div class="bubble max-bubble" id="filter-list">
            <a onclick="addCollator()" id="add-filter">+ Collator</a>
          </div>
          <span id="compile-errors" class="valid-json">Ready</span>
          <a id="save-button" onclick="save()" class="a-button">Save</a>
          <a id="delete-button" onclick="deletef()" class="a-button">Delete</a>
        </div>
      </div>
    </div>
  </body>
</html>
