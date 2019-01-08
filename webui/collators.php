<html>
  <head>
    <title>Liot R: Admin</title>
    <?php include 'head.php'?>
    <script>
      var collatorList;
      var reg = location.href.match(/after=(-?[0-9]+)/);
      var after = reg ? reg[1]*1 : 0;
      load(()=>{
        collatorList = grab('collator-list');
        Lir.listCollators({after: after, count: 30},res => {
          if(res.err) {
            alert(res.err);
          } else {
            console.log(res.collators);
            appendCollators(res.collators, collatorList);
          }
        })
      })
      function populate() {
        var collators = [];
        for(var i = 0; i < 100; i ++)
          collators.push({name:'OUTTHERM_'+i,
            device_info:
             { manufacture_date: 'UNKNOWN',
               manufacturer: 'AcuRite',
               model: 'UNKNOWN',
               series: 'UNKNOWN'
             }
           });
        Lir.addCollators({collators: collators}, res => {
          console.log(res.err || res)
        })
      }
      function gotoStart() {
        location.href = "/collators.php?after=0";
      }
      function gotoPrevious() {
        location.href = "/collators.php?after=" + Math.max(0,after-30);
      }
      function gotoNext() {
        location.href = "/collators.php?after=" + Math.max(0,after+30);
      }
      function gotoLast() {
        location.href = "/collators.php?after=-30";
      }
      function xss(text) { return text.replace('<', '&lt') }
      function nelem(type) { return document.createElement(type) }
    </script>
  </head>
  <body>
    <div id="content">
      <?php include 'nav.php'?>
      <h1>Collators <a href="new-collator.php">New</a></h1>
      <div class="bubbles" id="collator-list">
      </div>
      <div class="botnav">
        <a onclick="gotoStart()">&lt;&lt;</a>
        <a onclick="gotoPrevious()">&lt;</a>
        <a onclick="gotoNext()">&gt;</a>
        <a onclick="gotoLast()">&gt;&gt;</a>
        <button onclick="populate()">Populate</button>
      </div>
    </div>
  </body>
</html>
