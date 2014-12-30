/**
 * Created by Dave on 12/16/2014.
 */
/* begin demo script */

var canvas = document.getElementById("canvas"),
    canvasCol = document.getElementById('canvas-column'),
    ctx = canvas.getContext('2d'),
    w=0,
    h=0,
    renderArray = [],
    animFrame = null,
    engine = particles(ctx),
    followMouse = true;

var emitter = engine.emitter('flame');
var collection = engine.collection(emitter);
var _max = collection.getProp('max');

resizeCanvas();

var gui = new dat.GUI();
gui.add(collection.properties, 'stopped');
gui.add(collection.properties, 'cycleOnce').listen();
gui.add(window, 'followMouse').listen();
gui.add(window, 'exportParticle');
gui.add(collection, 'reset');
gui.addColor(collection.emitter.particle, 'color').listen();


var particleFolder = gui.addFolder('Particle'),
    collectionFolder = gui.addFolder('Collection'),
    emitterFolder = gui.addFolder('Emitter'),
    size= particleFolder.addFolder('Size'),
    speed = particleFolder.addFolder('Speed');



size.add(collection.emitter.particle.size, 'x',0, 100).listen();
size.add(collection.emitter.particle.size, 'y',0, 100).listen();
size.add(collection.emitter.particle.size, 'spread',0, 100).listen();
speed.add(collection.emitter.particle.speed, 'x').listen();
speed.add(collection.emitter.particle.speed, 'y').listen();
speed.add(collection.emitter.particle.speed, 'spread').min(0).listen();
particleFolder.add(collection.emitter.particle, 'gravity',0).min(0).listen();
particleFolder.add(collection.emitter.particle, 'direction',0, 2*Math.PI).listen()
    .onChange(function(value){
        collection.emitter.particle.spread = value;
    });
particleFolder.add(collection.emitter.particle, 'spread',0, 2*Math.PI).listen();
particleFolder.add(collection.emitter.particle, 'decay').min(0).listen();
particleFolder.add(collection.emitter.particle, 'alpha',0,1).listen();



collectionFolder.add(window, '_max').listen()
    .onChange(function(value){
        collection.setProp('max', value);
    })
    .onFinishChange(function(value){

    });
collectionFolder.add(collection.properties, 'density').listen();
emitterFolder.add(collection.emitter.properties, "height").min(1).step(5).listen();
emitterFolder.add(collection.emitter.properties, "width").min(1).step(5).listen();
emitterFolder.add(collection.emitter.properties.origin, "x").listen();
emitterFolder.add(collection.emitter.properties.origin, "y").listen();
//gui.add(emitter.properties, "width");

renderArray.push(collection);
animationLoop();

window.addEventListener('resize', resizeCanvas);

function exportParticle(json){
    var txtDiv = document.getElementById('particleText'),
        select = document.getElementById('selectText'),
        obj = collection.exportParticle();
    txtDiv.style.display = "block";

    select.value = obj;
    select.select();

    document.getElementById('close').addEventListener('click', function(e){
        e.preventDefault();
        txtDiv.style.display = 'none';
    });

}
function resizeCanvas(){
    ctx.canvas.width  = canvasCol.clientWidth;
    ctx.canvas.height = canvasCol.clientHeight;
    engine.updateContext(ctx);
    w = ctx.canvas.width;
    h = ctx.canvas.height;
    collection.emitter.setOrigin(w/2, h/2);
}

function animationLoop(){
    animFrame = requestAnimationFrame(animationLoop);
    if(renderArray.length > 0){
        ctx.clearRect(0,0,w,h);
        for(var i = 0; i < renderArray.length; i++){
            render(renderArray[i]);
        }

    }
}

function render(collection){
    collection.draw();
}
function reset(){
    resizeCanvas();
    collection.emitter.properties.width = 1;
    collection.properties.max = 100;
    collection.properties.density = 1;
    collection.properties.cycleOnce = false;
    collection.reset();
}
/*
listeners for UI
 */
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

canvas.addEventListener('mousemove', function(evt) {
    if(followMouse){
        var mousePos = getMousePos(canvas, evt);
        collection.emitter.setOrigin(mousePos.x, mousePos.y);
    }

}, false);

$('.help').on('click', function(e){
    $("#modal").show();
    $('#help').show();

});
$('#modal').on('click', function(e){
    $("#modal").hide();
    $('#help').hide();
});
$('.button-control').on('click', function(e){
    if($(this).hasClass('button-select')){
        console.log('already on');
    }else{
        $('.button-control').each(function(){
            $(this).removeClass('button-select');
        });
        $(this).addClass('button-select');
        collection.emitter.setParticle($(this).data('particle'));
        switch( $(this).data('particle') ){
            case 'explode':
                reset();
                collection.properties.max = 30;
                collection.properties.density = 20;
                collection.properties.cycleOnce = true;

                //reset();
                resizeCanvas();
                break;
            case 'snow' :
                reset();
                collection.emitter.setOrigin((ctx.canvas.width/2)-125, -40);
                collection.properties.max = 280;
                collection.properties.density = 2;
                collection.emitter.properties.width = 125;
                break;
            default :
                reset();
        }
    }

});
/* end demo script */