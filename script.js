mouseX = 0;
mouseY = 0;

// move circle
drag = false;
activeCircle = null;

$(function(){
    canvasDiv=document.getElementById("canvas");
    window.gr = new jxGraphics(canvasDiv);
    gr.getSVG().style.opacity = 0.5;

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

        if(getEditType() == 'add') {
            createCirlce(true);
        }

        if(getEditType() == 'delete'){
            if (activeCircle) {
                var layer = getLayer();

                if(typeof layer == 'string' && layer.length > 0){
                    var tmpCircles = [];
                    for (var j in layers[ layer ].circles) {
                        if(activeCircle.id != layers[ layer ].circles[j].id)
                        {
                            tmpCircles.push(layers[ layer ].circles[j]);
                        }
                        else{
                            layers[ layer ].circles[j].remove();
                        }
                    }
                    layers[ layer ].circles = tmpCircles;
                    if(tmpCircles.length < 3)
                        layers[ layer ].polygon.hide()

                }
            }
        }

        drag = false;
        activeCircle = null;
        reDrawPolygon();
    });

    //---------------------------------------------------

    var color_picker = document.getElementById("color-picker");
    var color_picker_wrapper = document.getElementById("color-picker-wrapper");
    color_picker.onchange = function() {
        color_picker_wrapper.style.backgroundColor = color_picker.value;
        reDrawPolygon();
    };
    color_picker_wrapper.style.backgroundColor = color_picker.value;



    $(document).on('change', '#layer', function(e){
        var elem = this;
        for(i in layers){
            if(layers.hasOwnProperty(i))
            {
                $('#name').val(layers[i].name);
                $('#speed').val(layers[i].speedLimit);
                for(j in layers[i].circles)
                {
                    if(i == elem.value)
                        layers[i].circles[j].show();
                    else
                        layers[i].circles[j].hide();
                }
            }
        }
    });

    $(document).on('change', '#name', function(e){
        var layer = getLayer();

        if(typeof layer != 'string' || layer.length == 0)
            return;

        layers[layer].name = this.value;
    });

    $(document).on('change', '#speed', function(e){
        var layer = getLayer();

        if(typeof layer != 'string' || layer.length == 0)
            return;

        layers[layer].speedLimit = this.value;
    });
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

    if(document.getElementById("color-picker").value!="")
    {
        color = new jxColor(document.getElementById("color-picker").value);
    }
    else
    {
        color = new jxColor("blue");
    }
    return  color
}

function getPen()
{
    // return new jxPen(getColor(), '1px');;
    return new jxPen(new jxColor("black"), '1px');;
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
    cir.id = layer + '_' + layers[ layer ].circles.length;

    if(show)
        cir.draw(gr);

    cir.addEventListener('mousedown', circleMouseDown);
    cir.addEventListener('mouseup', circleMouseUp);
    cir.addEventListener('mouseover', circleMouseOver);
    cir.addEventListener('mouseout', circleMouseOut);
    layers[ layer ].circles.push( cir );
    return cir;
}

//Mousedown event handler for circle
function circleMouseDown(evt, obj) {

    if(getEditType() == 'move') {
        drag = true;
    }

    if(getEditType() != 'add') {
        activeCircle = obj;
    }

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

    var layer = getLayer();

    if(typeof layer != 'string' || layer.length == 0)
        return;


    if(layers[ layer ].circles.length < 3)
        return;

    if (typeof layers[ layer ].polygon == 'undefined')
        layers[ layer ].polygon = new jxPolygon([], getPen(), getBrush())

    var points = [];

    for (var j in layers[ layer ].circles) {
        layers[ layer ].circles[ j ].brush = getBrush();
        points.push( layers[ layer ].circles[ j ].center )
    }

    layers[ layer ].polygon.points = points;
    layers[ layer ].polygon.brush = getBrush();
    layers[ layer ].polygon.draw(gr);

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

    layers[name] = {};

    layers[name].circles = [];
    layers[name].speedLimit = 0;
    layers[name].name = name;

    $('#layer').append(op);
    $('#layer').trigger('change');
}

function getLayer(){
    return $('#layer').val();
}

function clearCanvas(){
    for(i in layers){
        if(layers.hasOwnProperty(i))
        {
            for(j in layers[i].circles)
            {
                layers[i].circles[j].remove();
            }

            layers[i].polygon.remove();
        }
    }

    layers = {};

    $('#layer').html('');
}

function Export(){
    var data = [];

    for(i in layers){
        if(layers.hasOwnProperty(i))
        {
            var row = {};
            row.name = i;
            row.speedLimit = layers[i].speedLimit;
            row.X = [];
            row.Y = [];
            for(j in layers[i].circles)
            {
                row.X.push(layers[i].circles[j].center.x);
                row.Y.push(layers[i].circles[j].center.y);
            }
            data.push(row);
        }
    }

    $('#txt').html(JSON.stringify(data, null, 4));
}

function getEditType() {
    return document.getElementById('type').value;
}

