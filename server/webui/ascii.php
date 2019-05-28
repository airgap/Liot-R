<html>
<head>
<style>
html{
font-size:.2em;
}
</style>
</head>
<body>
<?php
$t = file_get_contents('copy.php');
preg_replace($t, "\n", "<br>");
echo $t;
?>
</body>
</html>
