<style>
textarea {
  width: 500px;
  height: 200px;
  font-size: 1em;
}
</style>

<script>
var COMPARATORS = [
  "EQUALS",
  "NEQUALS",
  "TFEQUALS",
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
function process() {
  var inputbox = document.getElementById('input');
  var input = inputbox.value;
  var outputbox = document.getElementById('output');
  var output = '';
  var updatebox = document.getElementById('update');
  var update = JSON.parse(updatebox.value);
  output = JSON.parse(input);
  //console.log(output)
  console.log(recur(output, update, 'ROOT'));
}
function recur(root, update, gate) {
  //console.log(gate)
  var left, right, res = false;
  left = evaluateProperty(root, update, 0);
  right = evaluateProperty(root, update, 1);
  switch(gate) {
    case 'ROOT':
      res = !!left;
      break;
    case 'AND':
      res = left && right;
      break;
    case 'OR':
      res = left || right;
      break;
    case 'NAND':
      res = !(left && right);
      break;
    case 'NOR':
      res = !(left || right);
      break;
    case 'XOR':
      res = (left || right) && !(left && right);
      break;

    case 'UNDER':
      res = left < right;
      break;
    case 'OVER':
      res = left > right;
      break;
    case 'EQUALS':
      res = left == right;
      break;
    case 'TFEQUALS':
      res = left === right;
      break;
    case 'NEQUALS':
      res = left != right;
      break;
    case 'TFNEQUALS':
      res = left !== right;
      break;
    case 'OVEROR':
      res = left >= right;
      break;
    case 'UNDEROR':
      res = left <= right;
      break;
  }
  console.log(root, left, right, gate, res)
  return res;
}
function getProperty(object, key) {
  for(var k of key.substring(1).split('.')) {
      console.log(k, object[k])
      if(typeof object[k] != 'undefined' && typeof object[k] != 'null')object = object[k];
      else return null;
    }
    console.log('PROP', object)
    return object;
}
function evaluateProperty(object, update, child) {
  var keys = Object.keys(object);
  var key = keys[child];
  var side = object[key];
  switch(typeof side) {
    case 'object':
      side = recur(side, update, key);
      break;
    case 'string':
      if(side[0] === "$") side = getProperty(update, side);
      break;
  }
  return side;
}
window.addEventListener('DOMContentLoaded',()=>{
  process();
})
</script>


<textarea id="input">{
  "AND": {
    "OR": {
      "UNDER": [ "$value.temperature", 96 ],
      "OVER": [ "$value.temperature", 100 ]
    },
    "EQUALS": [ "$device_info.manufacturer", "MeasureStat" ]
  }
}</textarea>
<textarea id="update">{
  "device_info":
     { "manufacture_date": "UNKNOWN",
       "manufacturer": "MeasureStat",
       "model": "UNKNOWN",
       "series": "UNKNOWN" },
     "value": { "temperature":989 } }</textarea>

<div id="output"></div>

<button onclick="process()">Process</button>
