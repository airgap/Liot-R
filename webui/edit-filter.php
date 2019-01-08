<html>
  <head>
    <title>Liot R: Edit Filter</title>
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
      load(()=>{
        Lir.getFilters({ids:[ID]}, res=>{
          var filter;
          //console.log(res)
          if(res.filters && (filter = res.filters[0])) {
          grab('item-id').innerHTML = '['+filter.id+']';
            grab('filter-name').value = filter.name||'';
            grab('filter-code').value = filter.code||'{}';
          }
          Lir.listFilterReferrers({ids:[ID]}, res => {
            if(res.err || !res.filters.length) {
              console.log(err || "No filter found.");
              return;
            }
            console.log(res)
            var filt = res.filters[0];
              grab('reference-count').innerHTML = "Used by " + filt.referrers.length + " collators."
              var referrerList = grab('referrer-list')
              appendCollators(filt.referrers, referrerList, ID);
              /*for(var referrer of filt.referrers) {
                var refbox = nelem('div');
                addc(refbox, 'bubble')
                refbox.innerHTML = referrer.name || "["+referrer.id+"]";
                bind(refbox, ()=>{
                  location.href = 'edit-collator.php?id='+referrer.id;
                })
                referrerList.appendChild(refbox);
              }*/
            console.log(filt.refcount);
            if(filt.referrers.length)addc('delete-button', 'disabled')
            if(filt.referrers.length)grab('delete-button').innerHTML = "Undeletable";
          })
        })
        var compileErrors = grab('compile-errors');
        var codeBox = grab('filter-code');
        bind(codeBox, 'input', () => {
          var code = codeBox.value;
          var json;
          try {
            json = JSON.parse(code);
            err();
          } catch(error) {
            err('Invalid JSON.');
            return;
          }
          var queued = 0;
          recur(json);
          function recur(tree, current) {
          //console.log(tree, current);
          queued ++;
          var top = typeof current == 'undefined';
            if(!top && (typeof tree[current] === 'number' || typeof tree[current] === 'string')) {
              if(!COMPARATORS.includes(current)) {
                err('All numbers and strings must reside in comparators.');
                return;
              }
            } else if(!Array.isArray(tree)) {
              if(!top && current && !OPERATORS.includes(current)) {
                err('Not a valid operator.');
                return;
              }
              var keys = Object.keys(tree);
              console.log(top && keys.length != 1)
                if(top && keys.length != 1) {
                  err("Root object must contain exactly one object, not " + keys.length);
                  return;
                }
              if(top || keys.length === 2) {
                for(var key of keys) {
                  if(COMPARATORS.includes(key)) {
                    recur(tree[key], key);
                  } else if(OPERATORS.includes(key)) {
                    recur(tree[key], key);
                  } else {
                    err('Invalid comparator or operator.');
                    return;
                  }
                }
              } else {
                err('Operator ' + current + ' expects 2 parameters, not ' + keys.length);
                return;
              }
            } else if(Array.isArray(tree)) {
              console.log('array: ' + current);
              if(!COMPARATORS.includes(current)) {
                err('Invalid comparator.');
                return;
              }
              if(tree.length != 2) {
                err('All comparators expect 2 parameters. Found ' + tree.length);
                return;
              }
            }
            queued--;
            //if(!queued)console.log("Done!");
          }
        })
      })
      function save() {
        //addc('save-button', 'disabled');
        err('Updating filter...');
        var name = grab('filter-name').value;
        var code = grab('filter-code').value;
        Lir.addFilters({
          filters:[{
          name: name,
          code: code,
          id: ID
        }]}, res => {
          if(res.err) {
            console.log(res.err);
            return;
          }
          location.href = "/filters.php";
        })
      }
      function deletef() {
        if(confirm("Are you sure you wish to delete this filter? This action cannot be undone.")) {
          Lir.deleteFilters({ids:[ID]},res=>{
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
      <h1>Edit Filter</h1>
      <h2 id="item-id">[abcdefgh-ijkl-mnop-qrst-uvwxyz012345]</h2>
      <div class="bubbles new-box" id="filter-box">
        <div class="bubble max-bubble">
          <label for="filter-name">Name:</label>
          <input id="filter-name" placeholder="Unnamed Filter" type="text">
          <label for="filter-code">Code:</label>
          <textarea id="filter-code" placeholder="Enter a JSON filter...">{
  "AND": {
    "OR": {
      "UNDER": [ "$value", 96 ],
      "OVER": [ "$value", 100 ]
    },
    "EQUALS": [ "$device_info.manufacturer", "MeasureStat" ]
  }
}</textarea>
          <a id="save-button" onclick="save()" class="a-button">Save</a>
          <a id="delete-button" onclick="deletef()" class="a-button">Delete</a>
                    <span id="reference-count">Ready</span>
                    <div id="referrer-list"></div>
        </div>
      </div>
    </div>
  </body>
</html>
