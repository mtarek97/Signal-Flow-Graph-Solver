var stageWidth = 1000;
var stageHeight = 600;

// first we need to create a stage
var stage = new Konva.Stage({
    container: 'container',
    width: stageWidth,
    height: stageHeight
});

// then create layer
var layer = new Konva.Layer();

// create our shape
var circle = new Konva.Circle({
    // center coordiantes
    x: stage.getWidth() / 2,
    y: stage.getHeight() / 2,
    radius: 70,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 4,
    shadowOffsetX: 20,
    shadowOffsetY: 25,
    shadowBlur: 40,
    opacity: 0.5,
    draggable: 'true'
});

circle.to({
    fill: 'green'
});

var simpleText = new Konva.Text({
    x: stage.getWidth() / 2,
    y: 15,
    text: 'Simple Text',
    fontSize: 30,
    fontFamily: 'Calibri',
    fill: 'green'
});

// to align text in the middle of the screen, we can set the
// shape offset to the center of the text shape after instantiating it
simpleText.setOffset({
    x: simpleText.getWidth() / 2
});

// tooltip
var tooltip = new Konva.Label({
    x: 170,
    y: 75,
    opacity: 0.75
});

var arc = new Konva.Arc({
    x: stage.getWidth() / 2,
    y: stage.getHeight() / 2,
    innerRadius: 40,
    outerRadius: 40,
    angle: 180,
    fill: 'yellow',
    stroke: 'black',
    strokeWidth: 4,
    draggable: 'true'
});


/*
 * create our branch shape by defining a
 * drawing function which draws a branch (arc with 3 points)
 */

var PI2 = Math.PI * 2;

var initial = {
    x: 20,
    y: 40
};
var median = {
    x: 40,
    y: 33
};
var final = {
    x: 180,
    y: 40
};

var controlX = 2 * median.x - initial.x / 2 - final.x / 2;
var controlY = 2 * median.y - initial.y / 2 - final.y / 2;

var branch = new Konva.Shape({
    sceneFunc: function (context) {

        context.beginPath();
        context.arc(initial.x, initial.y, 4, 0, PI2);
        context.closePath();
        context.moveTo(median.x, median.y);
        context.arc(median.x, median.y, 4, 0, PI2);
        context.closePath();
        context.moveTo(final.x, final.y);
        context.arc(final.x, final.y, 4, 0, PI2);
        context.closePath();
        context.fill();

        context.strokeStyle = 'red';
        context.beginPath();
        context.moveTo(initial.x, initial.y);
        context.quadraticCurveTo(controlX, controlY, final.x, final.y);
        context.stroke();
    },
    fill: '#00D2FF',
    stroke: 'black',
    strokeWidth: 4,
    draggable: 'true'
});

var fromX = 50;
var fromY = 50;
var toX = 100;
var toY = 50;
var cpX = 75;
var cpY = 100;

var triangle = new Konva.Shape({
    sceneFunc: function (context) {

        context.beginPath();
        context.moveTo(fromX, fromY);
        context.quadraticCurveTo(cpX, cpY, toX, toY);
        context.stroke();
        context.closePath();


    },
    fill: '#00D2FF',
    stroke: 'black',
    strokeWidth: 4,
    draggable: 'true'
});

// add the triangle shape to the layer
layer.add(triangle);



// add the triangle shape to the layer
layer.add(branch);




// add the shape to the layer
layer.add(arc);


// add the shape to the layer
layer.add(circle);
layer.add(simpleText);

// add the layer to the stage
stage.add(layer);


function fitStageIntoParentContainer() {
    var container = document.querySelector('#container');

    // now we need to fit stage into parent
    var containerWidth = container.offsetWidth;
    // to do this we need to scale the stage
    var scale = containerWidth / stageWidth;


    stage.width(stageWidth * scale);
    stage.height(stageHeight * scale);
    stage.scale({
        x: scale,
        y: scale
    });
    stage.draw();
}

fitStageIntoParentContainer();
// adapt the stage on any window resize
window.addEventListener('resize', fitStageIntoParentContainer);
