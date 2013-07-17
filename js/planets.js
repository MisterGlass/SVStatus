
$(document).ready(function() {
	reloadData();
	
	$('#left input').each(function() {
		$(this).click(function() {
			refreshGraph();
		});
	});
	
});

function getPlanets(player, x) {
    var planets = player['history'][x];
    if(!planets) planets = 0;
    return planets;
}

function getColor(player)	{
    if(player['color'].length == 6) return '#'+player['color'];

	name = player['username'].toLowerCase();
	var alphabet = new Array('a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z');
    alphabet.reverse();
	var color = '#';
	var hex = '';
	
	for(var i = 0; color.length < 6; i++)	{
		if(i<name.length)	{
			hex = Math.round((alphabet.indexOf(name[i])+1)*9.8).toString(16);
			if(hex.length == 1) hex = '0'+hex;
			color += hex;
		}
		else color += '00';
	}
	
	return color;
}

function refreshGraph()	{
	var url = '/schemaverse/planetsJSON.php';
	if(!showLatest)	url = "/schemaverse/planetsJSON.php?round="+round;
	$.getJSON(url,
		function(data){;
			drawGraph(data);
		}
	);
}

function reloadData()	{
    var sum = 0;
	var url = '/schemaverse/planetsJSON.php';
	if(!showLatest)	url = "/schemaverse/planetsJSON.php?round="+round;
	$.getJSON(url,
		function(data){
			drawGraph(data);
			
			$('#left').html('');
			$('#left').append('<p id="tic">Tic: '+data['x']+'</p>');
			for(var i=0;i<data['players'].length;i++)	{
                sum += parseInt(getPlanets(data['players'][i], data['x']));
				$('#left').append('<p style="color: '+getColor(data['players'][i])+'">'+data['players'][i]['username']+': '+getPlanets(data['players'][i], data['x'])+'</p>');
			}
			$('#left').append('<p style="color: FFF">Total: '+sum+'</p>');
            
			$('#bottom #round').html('Round #'+data['round'])
			$('#bottom a#prev').attr("href", "/schemaverse/planets.php?round="+(data['round']-1))
			
			setTimeout('reloadData()', 30000);
		}
	);
}

function drawGraph(data)	{
	var xResolution = 25;
	var yResolution = 200;
    
    if(data['x']<60) xResolution =5;
    else if(data['x']<150) xResolution = 15;
    if(data['y']<100) yResolution = 10;
    else if(data['y']<200) yResolution =25;
    else if(data['y']<400) yResolution =50;
    else if(data['y']<1000) yResolution =100;
	
	canvas = document.getElementById('myCanvas');
	context = canvas.getContext('2d');
    context.fillStyle = '#1B1B1B';
	context.fillRect(0, 0, canvas.width, canvas.height); //best way to clear a canvas (currently), draw a clear rectangle over the entire element
	
	actualWidth = 890;
	actualHeight = 590;
    if(data['x']>50)    widthRatio = actualWidth/data['x'];
    else    widthRatio = actualWidth/50;
	heightRatio = actualHeight/data['y'];
	
	// Draw axes
	context.fillStyle='#bbbbbb';
	context.font = 'bold 16pt sans-serif';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	
	context.lineCap = "square";
	context.lineJoin = "round";
	context.lineWidth = 1;
	context.strokeStyle='#333333';
	
	for(var i=xResolution;i<data['x'] || i<50;i=i+xResolution)	{
		context.beginPath();
		context.moveTo((i*widthRatio)+60,actualHeight);
		context.lineTo((i*widthRatio)+60,0);
		context.stroke();
		context.closePath();
		context.fillText(i, (i*widthRatio)+60, actualHeight+20);
	}
	for(var i=yResolution;i<(data['y']) || i<50;i=i+yResolution)	{
		context.beginPath();
		context.moveTo(60,actualHeight-(i*heightRatio));
		context.lineTo(actualWidth+60,actualHeight-(i*heightRatio));
		context.stroke();
		context.closePath();
		context.fillText(i, 25, actualHeight-(i*heightRatio));
	}
	
	context.lineWidth = 2;
	
	for(i=0;i<data['players'].length;i++)	{
		context.strokeStyle = getColor(data['players'][i]);
		context.beginPath();
		context.moveTo(60,actualHeight);
		for(var j=0;j<data['players'][i]['history'].length;j++)	{
			context.lineTo((j*widthRatio)+60,actualHeight-(data['players'][i]['history'][j]*heightRatio));
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
	context.lineTo(actualWidth+55,actualHeight+3);
	context.stroke();
	context.closePath();
}