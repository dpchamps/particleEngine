/**
 * Created by Dave on 12/16/2014.
 */
/* begin demo script */

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext('2d'),
    w=0,
    h=0,
    renderArray = [],
    animFrame = null,
    engine = particles(ctx);

var emitter = engine.emitter('test','test');
var collection = engine.collection(emitter);



resizeCanvas();
var gui = new dat.GUI();
gui.add(collection.properties, 'stopped');
gui.add(collection.properties, 'cycleOnce');
gui.add(collection, 'reset');
gui.addColor(emitter.particle, 'color');


var particleFolder = gui.addFolder('Particle'),
    collectionFolder = gui.addFolder('Collection'),
    emitterFolder = gui.addFolder('Emitter'),
    size= particleFolder.addFolder('Size'),
    speed = particleFolder.addFolder('Speed');


 
size.add(collection.emitter.particle.size, 'x',0, 100);
size.add(collection.emitter.particle.size, 'y',0, 100);
size.add(collection.emitter.particle.size, 'spread',0, 100);
speed.add(collection.emitter.particle.speed, 'x').min(0);
speed.add(collection.emitter.particle.speed, 'y').min(0);
speed.add(collection.emitter.particle.speed, 'spread').min(0);
particleFolder.add(collection.emitter.particle, 'direction',0, 2*Math.PI);
particleFolder.add(collection.emitter.particle, 'spread',0, 2*Math.PI);
particleFolder.add(collection.emitter.particle, 'decay').min(0);
particleFolder.add(collection.emitter.particle, 'alpha',0,1);



collectionFolder.add(collection.properties, 'max');
collectionFolder.add(collection.properties, 'density');
emitterFolder.add(emitter.properties, "height").min(0).step(5);
emitterFolder.add(emitter.properties, "width").min(0).step(5);
emitterFolder.add(emitter.properties.origin, "x");
emitterFolder.add(emitter.properties.origin, "y");
//gui.add(emitter.properties, "width");

renderArray.push(collection);
animationLoop();

window.addEventListener('resize', resizeCanvas);

function resizeCanvas(){
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    engine.updateContext(ctx);
    w = canvas.width;
    h = canvas.height;
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
/* end demo script */