<html>
  <head>
    <title>Liot R: Filters</title>
    <?php include 'head.php'?>
    <script>
      var filterList;
      var reg = location.href.match(/after=(-?[0-9]+)/);
      var after = reg ? reg[1]*1 : 0;
      load(()=>{
        filterList = grab('filter-list');
        Lir.listFilters({after: after, count: 30},res => {
          if(res.err) {
            alert(res.err);
          } else {
            console.log(res.filters);
            appendFilters(res.filters);
          }
        })
      })
      function appendFilters(filters) {
        for(var i = 0; i < filters.length; i ++) {
          var rec = filters[i];
          var bubble = nelem('div');
          addc(bubble, 'bubble');
          var nameBox = nelem('label');
          nameBox.innerHTML = xss((rec.name || rec.id) + ":");
          var idBox = nelem('label');
          idBox.innerHTML = xss(rec.id);

          var valBox = nelem('label');
          valBox.innerHTML = xss(rec.code.split('\n')[0])
          bubble.appendChild(nameBox);
          bubble.appendChild(valBox);
          //bubble.appendChild(idBox);
          filterList.appendChild(bubble);
        }
      }
      function stringValue(value) {
        switch(typeof value) {
          case 'object':
            value = JSON.stringify(value);
          case 'string':
            if(value.length < 30) {
              if(value.length == 0)
                value = "NO VALUE";
              return value;
            } else {
              return value.substring(0,27)+"...";
            }
            break;
          case 'number':
            return value+"";
            break;
        }
        return value;
      }
      function populate() {
        var filters = [];
        for(var i = 0; i < 100; i ++)
          filters.push({name:'OUTTHERM_'+i,
            device_info:
             { manufacture_date: 'UNKNOWN',
               manufacturer: 'AcuRite',
               model: 'UNKNOWN',
               series: 'UNKNOWN'
             }
           });
        Lir.addFilters({filters: filters}, res => {
          console.log(res.err || res)
        })
      }
      function gotoStart() {
        location.href = "/filters.php?after=0";
      }
      function gotoPrevious() {
        location.href = "/filters.php?after=" + Math.max(0,after-30);
      }
      function gotoNext() {
        location.href = "/filters.php?after=" + Math.max(0,after+30);
      }
      function gotoLast() {
        location.href = "/filters.php?after=-30";
      }
      function xss(text) { return text.replace('<', '&lt') }
      function nelem(type) { return document.createElement(type) }
    </script>
  </head>
  <body>
    <div id="content">
      <?php include 'nav.php'?>
      <div class="bubbles" id="filter-list">
      </div>
      <div class="botnav">
        <a onclick="gotoStart()">&lt;&lt;</a>
        <a onclick="gotoPrevious()">&lt;</a>
        <a onclick="gotoNext()">&gt;</a>
        <a onclick="gotoLast()">&gt;&gt;</a>
      </div>
      <button onclick="populate()">Populate</button>
    </div>
  </body>
</html>
