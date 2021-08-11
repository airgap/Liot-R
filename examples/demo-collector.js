var request = require("request");

var queue = 0;
var interval = setInterval(query, 5);
var counterval = setInterval(counter, 1000);

function counter() {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write("Q: " + queue);
}

function query() {
  //console.log("querying");
  queue++;
  request.post(
    {
      url: "http://localhost:7474",
      body: {
        accessor: "9903a075-86f5-48eb-b4a4-acb8b35c55f4",
        action: "push update",
        value: 63,
      },
      json: true,
    },
    (err, res, bod) => {
      //console.log(err || bod || res);
      queue--;
      //console.log(queue);
    }
  );
}
