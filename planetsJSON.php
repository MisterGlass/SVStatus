<?php
include_once "config.php";

$data = array('x' => 50, 'y' => 50, round=>1, 'players' => array());

//setup DB con
$db = new PDO('mysql:host='.$dbhost.';dbname='.$dbname, $dbuser, $dbpass);

//grab round # from get param or default to last round
if(isset($_GET['round']) && is_numeric($_GET['round']))	{
	$round = $_GET['round'];
}
else	{
	$round = $db->query("SELECT round FROM planet_stats order by round desc limit 1")->fetch()['round'];
}

$tics = $db->prepare("SELECT max(tic) as tics FROM `planet_stats` where round = ?");
$tics->execute(array($round)); //bind param to query
$data['x'] = $tics->fetch()[0];

$players = $db->prepare("SELECT username, color FROM `planet_stats` where round = ? group by username order by max(planets) desc"); //prep query
$players->execute(array($round)); //bind param to query
$players = $players->fetchAll(PDO::FETCH_ASSOC); //grab data

$data['round'] = $round;

foreach($players as $player)   {
    $playerdata = array('username'=>$player['username'], 'history'=>array(), 'color' => $player['color']);
    $history = $db->prepare("SELECT tic, planets, color FROM `planet_stats` where round = ? and username = ?"); //prep query
    $history->execute(array($round, $player['username'])); //bind param to query
    $history = $history->fetchAll(PDO::FETCH_ASSOC); //grab data
    $playerdata['history'] = array_fill(0,$data['x'],0);
    
    //$history2 = array_merge($history, array_fill(1, $tics, array('planets' => 0)))
    
    foreach($history as $tic)   {
        if($tic['planets']>$data['y']) $data['y'] = $tic['planets'];
        $playerdata['history'][$tic['tic']] = $tic['planets'];
    }
    $data['players'][] =  $playerdata;
}

echo json_encode($data); //output as JSON
?>