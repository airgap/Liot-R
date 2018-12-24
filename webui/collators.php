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
            appendCollators(res.collators);
          }
        })
      })
      function appendCollators(collators) {
        for(var i = 0; i < collators.length; i ++) {
          var rec = collators[i];
          var bubble = nelem('div');
          addc(bubble, 'bubble');
          var nameBox = nelem('label');
          nameBox.innerHTML = xss((rec.name || rec.id) + "");
          var idBox = nelem('label');
          idBox.innerHTML = xss(rec.id);

          var valBox = nelem('label');
          //addc(valBox, 'filters-tooltip');
          var filternames = '';
          for(var filtret of rec.filtrets)filternames += (filtret.name || filtret.id.substring(0,10)) + ', ';
          filternames = "("+filternames.substring(0,filternames.length-2)+")";
          valBox.innerHTML = xss(filternames)
          bubble.appendChild(nameBox);
          bubble.appendChild(valBox);
          //bubble.appendChild(idBox);
          collatorList.appendChild(bubble);
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
      <div class="bubbles" id="collator-list">
      </div>
      <a onclick="gotoStart()">&lt;&lt;</a>
      <a onclick="gotoPrevious()">&lt;</a>
      <a onclick="gotoNext()">&gt;</a>
      <a onclick="gotoLast()">&gt;&gt;</a>
      <button onclick="populate()">Populate</button>
    </div>
  </body>
</html>
