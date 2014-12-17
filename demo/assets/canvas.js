/**
 * Created by Dave on 12/16/2014.
 */
/* begin demo script */

var engine = particleEngine();



var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext('2d'),
    w=0,
    h=0,
    renderArray = [],
    animFrame = null;


var cluster = engine.particleSet(
    {x: 250,
        y: 250
    },
    [250,200,200],
    Math.sqrt((w*w)+(h*h)) / 2,
    {
        max: 120,
        density: 1
    }
);
resizeCanvas();

renderArray.push(cluster);
animationLoop();

window.addEventListener('resize', resizeCanvas);

function resizeCanvas(){
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    w = canvas.width;
    h = canvas.height;
    cluster.origin = {
        x: w+20,
        y: -20
    };
    cluster.degradeRate = Math.sqrt((w*w)+(h*h));
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

function render(cluster){
    cluster.fountain(function(){
        var i = 0;

        if(cluster.numParticles()<cluster.max){
            while(i++ < cluster.density && cluster.numParticles() < cluster.max){
                cluster.addParticle({
                    dir: Math.PI + (Math.random()*(3*Math.PI/2 - Math.PI)),
                    speed: {
                        x: (Math.random()*2)+2,
                        y: (Math.random()*2)+2
                    },
                    alpha: 1,
                    size: (Math.random()*2)+3
                });
            }
        }
    });

    cluster.step(ctx);
}
/* end demo script */