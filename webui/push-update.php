<html>
  <head>
    <title>Liot R: New Distributor</title>
    <?php include 'head.php'?>
    <script>

      load(()=>{

      })

      function save() {
        //addc('save-button', 'disabled');
        err('Creating distributor...');
        var update = grab('update').value;

        LiotR.pushUpdate(JSON.parse(update), res => {
          if(res.err) {
            console.log(res.err);
            return;
          }
          location.href = "/distributors.php";
        })

        //LiotR.pushUpdate({value:98,accessor:'<AUTH_CODE>'});
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
      <h1>Push Update</h1>
      <div class="bubbles new-box" id="collator-box">
        <div class="bubble">
          <label for="distributor-name">Name:</label>
          <textarea id="update">{
  "device_info":
     { "manufacture_date": "UNKNOWN",
       "manufacturer": "MeasureStat",
       "model": "UNKNOWN",
       "series": "UNKNOWN" },
     "value": { "temperature":989 },
   "accessor": "9903a075-86f5-48eb-b4a4-acb8b35c55f4" }</textarea>

          <span id="compile-errors" class="valid-json">Ready</span>
          <a id="save-button" onclick="save()" class="a-button">Save</a>
        </div>
      </div>
    </div>
  </body>
</html>
