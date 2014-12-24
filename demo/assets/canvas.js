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
renderArray.push(collection);
animationLoop();

window.addEventListener('resize', resizeCanvas);

function resizeCanvas(){
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    engine.updateContext(ctx);
    w = canvas.width;
    h = canvas.height;
    console.log(w, h);
    collection.emitter.setOrigin(w/2, h/2);


}

function animationLoop(){
    animFrame = requestAnimationFrame(animationLoop);
    if(renderArray.length > 0){
        ctx.clearRect(0,0,w,h);
        for(var i = 0; i < renderArray.length; i++){
            render(renderArray[i]);
            if(renderArray[i].numParticles() <= 0){
                renderArray.splice(i,1);
            }
        }

    }
}

function render(collection){

    collection.draw();
}
/* end demo script */