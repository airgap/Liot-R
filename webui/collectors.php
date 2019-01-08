<html>
  <head>
    <title>Liot R: Admin</title>
    <?php include 'head.php'?>
    <script>
      var collectorList;
      var reg = location.href.match(/after=(-?[0-9]+)/);
      var after = reg ? reg[1]*1 : 0;
      load(()=>{
        collectorList = grab('collector-list');
        Lir.listCollectors({after: after, count: 30},res => {
          if(res.err) {
            alert(res.err);
          } else {
            console.log(res.collectors);
            appendCollectors(res.collectors, collectorList);
          }
        })
      })
      /*function appendCollectors(collectors) {
        for(var i = 0; i < collectors.length; i ++) {
          var rec = collectors[i];
          var bubble = nelem('div');
          addc(bubble, 'bubble');
          var nameBox = nelem('label');
          nameBox.innerHTML = xss((rec.name || rec.id) + ":");
          var idBox = nelem('label');
          idBox.innerHTML = xss(rec.id);

          var valBox = nelem('label');
          valBox.innerHTML = xss(stringValue(rec.value))
          bubble.appendChild(nameBox);
          bubble.appendChild(valBox);
          //bubble.appendChild(idBox);
          collectorList.appendChild(bubble);
          bindBubble(bubble,rec)
        }
      }*/
      function populate() {
        var collectors = [];
        for(var i = 0; i < 100; i ++)
          collectors.push({name:'OUTTHERM_'+i,
            device_info:
             { manufacture_date: 'UNKNOWN',
               manufacturer: 'AcuRite',
               model: 'UNKNOWN',
               series: 'UNKNOWN'
             }
           });
        Lir.addCollectors({collectors: collectors}, res => {
          console.log(res.err || res)
        })
      }
      function gotoStart() {
        location.href = "/collectors.php?after=0";
      }
      function gotoPrevious() {
        location.href = "/collectors.php?after=" + Math.max(0,after-30);
      }
      function gotoNext() {
        location.href = "/collectors.php?after=" + Math.max(0,after+30);
      }
      function gotoLast() {
        location.href = "/collectors.php?after=-30";
      }
      function xss(text) { return text.replace('<', '&lt') }
      function nelem(type) { return document.createElement(type) }
    </script>
  </head>
  <body>
    <div id="content">
      <?php include 'nav.php'?>
      <h1>Collectors <a href="new-collector.php">New</a></h1>

      <div class="bubbles" id="collector-list">
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
