<html>
  <head>
    <title>Liot R: Filters</title>
    <?php include 'head.php'?>
    <script>
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
        LiotR.listFilters({}, res => {
          if(res.err) {
            console.log(res.err)
            return;
          }
          filters = res.filters;
          //for(var filter of res.filters)filters.push({id:filter.id,name:filter.name})
        })
      })
      function addFilter() {
        var select = document.createElement('select');
        for(var filter of filters) {
          var option = document.createElement('option');
          option.value = filter.id;
          option.innerHTML = filter.name;
          select.appendChild(option);
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
        LiotR.addCollators({
          collators:[{
          name: name,
          filters: filtrets
        }]}, res => {
          if(res.err) {
            console.log(res.err);
            return;
          }
          location.href = "/collators.php";
        })
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
      <h1>New Collator</h1>
      <div class="bubbles new-box" id="filter-box">
        <div class="bubble max-bubble">
          <label for="collator-name">Name:</label>
          <input id="collator-name" placeholder="New Collator" type="text" value="Dangerous Temperature Collator">
          <label>Filters:</label>
          <div class="bubble max-bubble" id="filter-list">
            <a onclick="addFilter()" id="add-filter">+ Filter</a>
          </div>
          <span id="compile-errors" class="valid-json">Ready</span>
          <a id="save-button" onclick="save()" class="a-button">Save</a>
        </div>
      </div>
    </div>
  </body>
</html>
