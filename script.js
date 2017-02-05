mouseX = 0;
mouseY = 0;

// move circle
drag = false;
activeCircle = null;
waypoints = [];

$(function(){
    canvasDiv=document.getElementById("canvas");
    window.gr = new jxGraphics(canvasDiv);

    $(document).on('mousemove','#canvas',function(e){
        getMouseXY(e);

        if (drag) {
            if (activeCircle) {
                activeCircle.center = new jxPoint(mouseX, mouseY);
                activeCircle.draw(gr);
                reDrawPolygon();
            }
        }
    });

    $(document).on('mouseup','#canvas',function(){
        drag = false;
        if(activeCircle == null) {
            createCirlce(true);
        }
        activeCircle = null;
        reDrawPolygon();
    });

    //---------------------------------------------------
})
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

    $('.mouse_helper').css({left: (mouseX+15)+'px', top:(mouseY+15)+'px'}).text('X: '+(mouseX-1280) + ' Y: ' + (1280-mouseY));

    // mouseX = mouseX - canvasDiv.offsetLeft;
    // mouseY = mouseY - canvasDiv.offsetTop;

    return true;
}

function getColor()
{
    var color = null;

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
    return new jxPen(getColor(), '1px');;
}

function getBrush()
{
    return new jxBrush( getColor() )
}

function createCirlce(show)
{
    var layer = getLayer();

    if(typeof layer != 'string' || layer.length == 0)
        return;

    var cir = new jxCircle(new jxPoint(mouseX,mouseY), 5, getPen(), getBrush());
    cir.id = layers[ getLayer()].circles.length;

    if(show)
        cir.draw(gr);

    cir.addEventListener('mousedown', circleMouseDown);
    cir.addEventListener('mouseup', circleMouseUp);
    cir.addEventListener('mouseover', circleMouseOver);
    cir.addEventListener('mouseout', circleMouseOut);
    layers[ getLayer()].circles.push( cir );
    return cir;
}

//Mousedown event handler for circle
function circleMouseDown(evt, obj) {

    drag = true;
    activeCircle = obj;

}

//Mouseup event handler for circle
function circleMouseUp(evt, obj) {
    //activeCircle = null;
}

function circleMouseOver(evt, obj) {

    document.body.style.cursor = "pointer";

    obj.brush = new jxBrush(new jxColor("red"));
    obj.draw(gr);

}

function circleMouseOut(evt, obj) {

    document.body.style.cursor = "inherit";

    obj.brush = new jxBrush(getColor());
    obj.draw(gr);

}

function reDrawPolygon() {

    for(var i in layers)
    {
        if(layers.hasOwnProperty( i ))
        {
            if(layers[ i ].circles.length < 3)
                continue;

            if (typeof layers[ i ].polygon == 'undefined')
                layers[ i ].polygon = new jxPolygon([], getPen(), getBrush())

            var points = [];

            for (var j in layers[ i ].circles) {
                points.push( layers[ i ].circles[ j ].center )
            }

            layers[ i ].polygon.points = points;
            layers[ i ].polygon.draw(gr);
        }
    }
}


function track(track)
{
    canvasDiv.style.backgroundImage = "url(http://img.lfs.net/remote/maps/"+track+".jpg)";
    return false;
}

window.layers = {};

function addLayer() {
    var op = document.createElement('option');
    var name = prompt('Input layer name');
    if(name.length <= 0){
        alert('name is empty');
        return undefined;
    }
    op.selected = true;
    op.value = op.innerHTML = name;

   $('#layer').append(op);

    layers[name] = {};

    layers[name].circles = [];
    layers[name].speedLimit = 0;
}

function getLayer(){
    return $('#layer').val();
}
