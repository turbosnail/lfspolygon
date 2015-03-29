mouseX = 0
mouseY = 0


d1 = false;
d2 = false;
rects = new Array();
points=new Array();
polygons = new Array();



function init(){
	// alert(1)

	canvasDiv=document.getElementById("canvas");
	canvasDiv.onmousemove = getMouseXY;
	canvasDiv.onclick = drawPoint;

	window.gr = new jxGraphics(canvasDiv);
}


//Get mouse position
function getMouseXY(e)
{

	if (document.all) //For IE
	{
		mouseX = event.clientX + document.body.parentElement.scrollLeft;
		mouseY = event.clientY + document.body.parentElement.scrollTop;
	}
	else
	{
		mouseX = e.pageX
		mouseY = e.pageY
	}

	if (mouseX < 0){mouseX = 0}
	if (mouseY < 0){mouseY = 0}

	mouseX =mouseX - canvasDiv.offsetLeft;
	mouseY =mouseY - canvasDiv.offsetTop;

	return true;
}

function getColor()
{
	var color = false;

	if(document.getElementById("color").value!="")
	{
		color = new jxColor(document.getElementById("color").value);
	}
	else
	{
		color = new jxColor("blue");
	}
	return  color
}

function getPen()
{

	var pen = false;

	if(document.getElementById("penwidth").value!="")
		penWidth=parseInt(document.getElementById("penwidth").value);

	if(!isNaN(penWidth) && penwidth > 0)
		pen=new jxPen(getColor(), penWidth+'px');
	else
		pen=new jxPen(getColor(), '1px');

	return pen;
}

function getBrush()
{
	brush=new jxBrush( getColor() );
}

function checkPoints(noAlert)
{
	if(!noAlert)
	{
		if(points.length==0)
		{
			alert("Please click at any location on the blank canvas at left side to plot the points!");
			return false;
		}
		else if(points.length<3)
		{
			alert("3 or more points are required to draw a polygon! Please plot more points by clicking at any location on the blank canvas at left side.");
			return false;
		}
	}
	return true;
}

function drawPoint()
{

	rect = new jxRect(new jxPoint(mouseX-1,mouseY-1),2,2,getPen(), getBrush());
	rect.draw(gr);
	rects.push(rect);
	var point = new jxPoint(mouseX,mouseY)
	points.push(point);
	console.log(point)
	return point;
}


function drawPolyline()
{
	if(!checkPoints())
	    return;

	polyline = new jxPolyline(points,getPen(), getBrush());
	polyline.draw(gr);

	ShowPoints();
}

function drawLine()
{
	if(!checkPoints())
	    return;

	gr.drawLine(pen,points[points.length-2],points[points.length-1]);

	ShowPoints();
}

function fillPolygon()
{
	if(!checkPoints())
	    return;

	polygon = new jxPolygon(points,getPen(), getBrush());
	polygon.draw(gr);

	polygons[polygons.length] = polygon;

	ShowPoints();
}


function clearCanvas()
{
	//gr.clear();

	for(i in polygons)
	{
		polygons[i].remove()
	}

	for(i in rects)
	{
		rects[i].remove()
	}


	points=new Array();
	polygons = new Array();
	rects = new Array();
	var txt=document.getElementById("txt").value = "";
}

function clearPreviousPoints()
{
	for(i in rects)
	{
		rects[i].remove()
	}

	points=new Array();
	rects = new Array();
}

function ShowPoints()
{
	var txt = document.getElementById("txt");
	var json = document.getElementById("json").checked;
	// txt.value="";
	if(json)
	{
		if(txt.value.length)
			txt.value += ',\n';

		txt.value += '{\n  X:[';
		for(var i=0;i<points.length;i++)
		{
			if(i>0)
				txt.value += ', ';

			txt.value +=  (points[i].x - 1280);
		}
		txt.value += '],';

		txt.value += '\n  Y:[';
		for(var i=0;i<points.length;i++)
		{
			if(i>0)
				txt.value += ', ';

			txt.value +=  (points[i].y - 1280);
		}
		txt.value += '],\n}';
	}
	else
	{
		for(var i=0;i<points.length;i++)
		{
			txt.value +=  (points[i].x - 1280) + ";" + (1280 - points[i].y) + "\n";
		}
	}
}

function track(track)
{
	canvasDiv.style.backgroundImage = "url(img/"+track+".jpg)";
	return false;
}