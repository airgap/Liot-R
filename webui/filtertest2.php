<style>
textarea {
  width: 400px;
  height: 400px;
  font-size: 1em;
}
</style>

<script>
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
function process() {
  var inputbox = document.getElementById('input');
  var input = inputbox.value;
  var outputbox = document.getElementById('output');
  var output = '';
  output = JSON.parse(input);
  console.log(output)
}
window.addEventListener('DOMContentLoaded',()=>{
  process();
})
</script>


<textarea id="input">{
  "AND": {
    "OR": {
      "UNDER": [
        "$value.temperature",
        32
      ],
      "OVER": [
        "$value.temperature",
        115
      ]
    },
    "EQUALS": [
      "$device_info.manufacturer",
      "AcuRite"
    ]
  }
}</textarea>

<div id="output"></div>

<button onclick="process()">Process</button>
