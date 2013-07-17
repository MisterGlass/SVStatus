
$(document).ready(function() {
	reloadData();
	
	$('#left input').each(function() {
		$(this).click(function() {
			refreshGraph();
		});
	});
	
});

function refreshGraph()	{
	var url = '/schemaverse/svJSON.php';
	if(!showLatest)	url = "/schemaverse/svJSON.php?round="+round;
	$.getJSON(url,
		function(data){;
			drawGraph(data);
		}
	);
}

function reloadData()	{
	var url = '/schemaverse/svJSON.php';
	if(!showLatest)	url = "/schemaverse/svJSON.php?round="+round;
	$.getJSON(url,
		function(data){
			var logs = data;
			drawGraph(logs);
			
			latest = logs[logs.length-1];
			
			$('#tic span').html(latest['tic']);
			$('#assets span').html(latest['assets']);
			$('#planets span').html(latest['planets']);
			$('#ships span').html(latest['ships']);
			$('#miners span').html(latest['miners']);
			$('#attackers span').html(latest['attackers']);
			
			$('#bottom #round').html('Round #'+latest['round'])
			$('#bottom a#prev').attr("href", "/schemaverse/svStatus.php?round="+(latest['round']-1))
			
			setTimeout('reloadData()', 30000);
		}
	);
}

function drawGraph(logs)	{
	canvas = document.getElementById('myCanvas');
	context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height); //best way to clear a canvas (currently), draw a clear rectangle over the entire element
	
	//set or determine the X & Y ranges for our graph
	var topNum = 100;
	var topAssets = 10000;
	for(i=0;i<logs.length;i++)	{
		if(topNum<Math.round(logs[i]['planets'])+10)	{
			topNum=Math.round(logs[i]['planets'])+10;
		}
		if(topNum<Math.round(logs[i]['ships'])+10)	{
			topNum=Math.round(logs[i]['ships'])+10;
		}
		if(topAssets<Math.round(logs[i]['assets'])+10)	{
			topAssets=Math.round(logs[i]['assets'])+10;
		}
	}
	topTics = 50;
	if(logs[logs.length-1]['tic'] > topTics) topTics = logs[logs.length-1]['tic'];
	
	actualWidth = 940;
	actualHeight = 590;
	widthRatio = actualWidth/topTics;
	heightRatio = actualHeight/topNum;
	assetHeightRatio = actualHeight/Math.log(topAssets);
	
	context.lineWidth = 2;
	context.lineCap = "square";
	context.lineJoin = "round";
	
	if ($('#ships input').attr('checked'))	{
		context.strokeStyle = "#F4D35A";
		context.beginPath();
		context.moveTo(60,actualHeight);
		for(i=0;i<logs.length;i++)	{
			context.lineTo((logs[i]['tic']*widthRatio)+60,actualHeight-(logs[i]['ships']*heightRatio));
		}
		context.stroke();
		context.closePath();
	}
	
	if ($('#miners input').attr('checked'))	{
		context.strokeStyle = "#54A0E2";
		context.beginPath();
		context.moveTo(60,actualHeight);
		for(i=0;i<logs.length;i++)	{
			context.lineTo((logs[i]['tic']*widthRatio)+60,actualHeight-(logs[i]['miners']*heightRatio));
		}
		context.stroke();
		context.closePath();
	}
	
	if ($('#attackers input').attr('checked'))	{
		context.strokeStyle = "#FEB59C";
		context.beginPath();
		context.moveTo(60,actualHeight);
		for(i=0;i<logs.length;i++)	{
			context.lineTo((logs[i]['tic']*widthRatio)+60,actualHeight-(logs[i]['attackers']*heightRatio));
		}
		context.stroke();
		context.closePath();
	}
	var a = 0;
	if ($('#assets input').attr('checked'))	{
		context.strokeStyle = "#A179CE";
		context.beginPath();
		context.moveTo(60,actualHeight);
		for(i=0;i<logs.length;i++)	{
            if(logs[i]['assets'] != 0) a = Math.log(logs[i]['assets']);
            else a = 0;
			context.lineTo((logs[i]['tic']*widthRatio)+60,actualHeight-(a*assetHeightRatio));
		}
		context.stroke();
		context.closePath();
	}
	
	if ($('#planets input').attr('checked'))	{
		context.strokeStyle = "#64992C";
		context.beginPath();
		context.moveTo(60,actualHeight);
		for(i=0;i<logs.length;i++)	{
			context.lineTo((logs[i]['tic']*widthRatio)+60,actualHeight-(logs[i]['planets']*heightRatio));
		}
		context.stroke();
		context.closePath();
	}
	
	//draw sides
	context.lineWidth = 7;
	context.lineCap = "round";
	context.lineJoin = "miter";
	context.strokeStyle = "#444444";
	context.beginPath();
	context.moveTo(56,10);
	context.lineTo(56,actualHeight+3);
	context.lineTo(actualWidth,actualHeight+3);
	context.stroke();
	context.closePath();
}