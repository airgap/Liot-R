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
        LiotR.listFilters({after: after, count: 30},res => {
          if(res.err) {
            alert(res.err);
          } else {
            console.log(res.filters);
            appendFilters(res.filters, filterList);
          }
        })
      })
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
        LiotR.addFilters({filters: filters}, res => {
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
      <h1>Filters <a href="new-filter.php">New</a></h1>
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
