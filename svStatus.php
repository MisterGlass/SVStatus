<?php
include_once "config.php";

//setup DB con
$db = new PDO('mysql:host=localhost;dbname='.$dbname, $dbuser, $dbpass);

//grab round # from get param or default to latest round
if(isset($_GET['round']) && is_numeric($_GET['round']))	{
	$round = $_GET['round'];
	$showLatest = 'false';
}
else	{
	$round = $db->query("SELECT round FROM logs order by round desc limit 1")->fetch()['round'];
	$showLatest = 'true';
}

//check for logs of previous/next round
$q = $db->prepare("SELECT * FROM logs  WHERE round=?");
$q->execute(array($round-1));
$numPrev = $q->rowCount();

$q = $db->prepare("SELECT * FROM logs  WHERE round=?");
$q->execute(array($round+1));
$numNext = $q->rowCount();

?>

<html>
<!-- Coded by Yair Silbermintz - yair[at]silbermintz.com -->
<head>
	<title>MrGlass Schevemarse Status</title>
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
	<meta name="robots" content="noindex, nofollow" />
	
	<link rel="stylesheet" type="text/css" href="css/main.css" />
</head>
<body>
	<canvas id="myCanvas" width="900" height="600"></canvas>
	<div id="left">
		<p id="tic">Tic: <span></span></p>
		<p id="assets"><input type="checkbox" checked="yes" />Assets: <span></span></p>
		<p id="planets"><input type="checkbox" checked="yes" />Planets: <span></span></p>
		<p id="ships"><input type="checkbox" checked="yes" />Ships: <span></span></p>
		<p id="miners"><input type="checkbox" checked="yes" />Miners: <span></span></p>
		<p id="attackers"><input type="checkbox" checked="yes" />Attackers: <span></span></p>
	</div>
	<div class="clear"></div>
	<div id="bottom">
		<?php	if($numPrev)	{	?> 
			<a id="prev" href="svStatus.php?round=<?php echo $round-1; ?>">&lt;</a>
		<?php	}	?>
		<span id="round">Round #</span>
		<?php	if($numNext)	{	?> 
			<a href="svStatus.php?round=<?php echo $round+1; ?>">&gt;</a>
			<a href="svStatus.php">&gt;&gt;</a>
		<?php	}	?>
    </div>
        
	<script>var round = <?php echo $round; ?>; var showLatest = <?php echo $showLatest; ?></script>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js" type="text/javascript"></script>
	<script src="js/main.js" type="text/javascript"></script>
</body>
</html>