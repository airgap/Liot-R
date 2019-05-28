<html>
  <head>
    <title>Liot R: Edit Collector</title>
    <?php include 'head.php'?>
    <script>
    var ID = '<?=isset($_GET['id'])?$_GET['id']:0?>';
      load(()=>{
        LiotR.getCollectors({ids:[ID]}, res => {
          if(res.err)err('Error retreiving collector.')
          else if(!res.collectors.length) err('Invalid collector selected.')
          else {
            var c = res.collectors[0]
            if(typeof c.name === 'string')
              grab('collector-name').value = c.name
              if(typeof c.device_info == 'object')
                for(var t of 'manufacturer model series'.split(' '))
                  if(typeof c.device_info[t] === 'string')
                    grab('collector-'+t).value = c.device_info[t];
          }
        })
      })
      function save() {
        //addc('save-button', 'disabled');
        err('Creating collector...');
        var collector = {name:grab('collector-name').value,device_info:{}}
        for(var t of 'manufacturer model series'.split(' ')) {
          collector.device_info[t] = grab('collector-'+t).value
        }
        LiotR.addCollectors({
          collectors:[collector]}, res => {
          if(res.err) {
            console.log(res.err);
            return;
          }
          location.href = "/collectors.php";
        })
      }
      //Delete the filter
      function deletec() {
        if(confirm("Are you sure you wish to delete this collector? This action cannot be undone.")) {
          LiotR.deleteCollectors({ids:[ID]},res=>{
            location.href = 'collectors.php';
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
      <h1>Edit Collector</h1>
      <div class="bubbles new-box" id="filter-box">
        <div class="bubble max-bubble">
          <label for="collector-name">Name:</label>
          <input id="collector-name" placeholder="New Collector" type="text" value="Thermometer">
          <label for="collector-manufacturer">Manufacturer:</label>
          <input id="collector-manufacturer" placeholder="None" type="text" value="">
          <label for="collector-model">Model:</label>
          <input id="collector-model" placeholder="None" type="text" value="">
          <label for="collector-series">Series:</label>
          <input id="collector-series" placeholder="None" type="text" value="">

          <span id="compile-errors" class="valid-json">Ready</span>
          <a id="save-button" onclick="save()" class="a-button">Save</a>
          <a id="delete-button" onclick="deletec()" class="a-button">Delete</a>
        </div>
      </div>
    </div>
  </body>
</html>
