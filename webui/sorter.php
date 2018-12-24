<script>
function sortify(text) {
var reg = /([A-Za-z]+|[0-9]+|.+?)/g;
var score = 0;
var regontxt = text.match(reg);
if(regontxt) {
  for(var i = 0; i < regontxt.length; i ++) {
    var match = regontxt[i]
    if(match.match(/^[A-Za-z]+$/)) {
      for(var l in match)score += match.charCodeAt(l);
    } else if(match.match(/^[0-9]+$/)) {
      score += match*1;
    } else {
      for(var l in match)score += match.charCodeAt(l);
    }
  }
}
return score
}

</script>
