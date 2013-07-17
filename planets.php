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
	$round = $db->query("SELECT round FROM planet_stats order by round desc limit 1")->fetch()['round'];
	$showLatest = 'true';
}

//check for logs of previous/next round
$q = $db->prepare("SELECT * FROM planet_stats  WHERE round=?");
$q->execute(array($round-1));
$numPrev = $q->rowCount();

$q = $db->prepare("SELECT * FROM planet_stats  WHERE round=?");
$q->execute(array($round+1));
$numNext = $q->rowCount();

?>

<html>
<!-- Coded by Yair Silbermintz - yair[at]silbermintz.com -->
<head>
	<title>Schevemarse Planet Supremacy Graph</title>
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
	<meta name="robots" content="noindex, nofollow" />
	
	<link rel="stylesheet" type="text/css" href="css/main.css" />
</head>
<body>
	<canvas id="myCanvas" width="950" height="630"></canvas>
	<div id="left">
		<p>
			<label>
				<input type="checkbox" />
				<strong> <span></span></strong>
			</label>
		</p>
	</div>
	<div class="clear"></div>
	<div id="bottom">
		<?php	if($numPrev)	{	?> 
			<a id="prev" href="planets.php?round=<?php echo $round-1; ?>">&lt;</a>
		<?php	}	?>
		<span id="round">Round #</span>
		<?php	if($numNext)	{	?> 
			<a href="planets.php?round=<?php echo $round+1; ?>">&gt;</a>
			<a href="planets.php">&gt;&gt;</a>
		<?php	}	?>
    </div>
        
	<script>var round = <?php echo $round; ?>; var showLatest = <?php echo $showLatest; ?></script>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js" type="text/javascript"></script>
	<script src="js/planets.js" type="text/javascript"></script>
</body>
</html>