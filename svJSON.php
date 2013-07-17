<?php
include_once "config.php";

//setup DB con
$db = new PDO('mysql:host='.$dbhost.';dbname='.$dbname, $dbuser, $dbpass);

//grab round # from get param or default to last round
if(isset($_GET['round']) && is_numeric($_GET['round']))	{
	$round = $_GET['round'];
}
else	{
	$round = $db->query("SELECT round FROM logs order by round desc limit 1")->fetch()['round'];
}

$data = $db->prepare("SELECT * FROM logs  WHERE round=? order by tic asc"); //prep query
$data->execute(array($round)); //bind param to query
$data = $data->fetchAll(PDO::FETCH_ASSOC); //grab data
echo json_encode($data); //output as JSON
?>