/* particleEngine main */

var document = root.document || {};

var particles = function(context) {
    /*
    todo: let's make sure this is actually a canvas 2d context
     */
    if(typeof context === 'undefined'){
        throw new Error('particles must be defined with a canvas context');
    }
    /*
    An extend function
     */
    function extend(dest, sources){
        var args = Array.prototype.slice.call(arguments);
        for(var i = 1; i < args.length; i++){
            for(var key in args[i]){
                if(args[i].hasOwnProperty(key)){
                    dest[key] = args[i][key];
                }
            }
        }
        return dest;
    }

    /*

        Pre-defined functions for emitter

     */
    var emitterFunctions = {
        fountain : function(){
            console.log("fountain");
        },
        explosion : function(){
            console.log("explosion");
        },
        stream : function(){
            console.log("stream");
        }
    };

    /*

        Pre-defined particle Types

     */
    var particleTypes = {
        snow : {

        },
        rain : {

        },
        fire : {

        },
        ice : {

        },
        smoke : {

        }
    };

    /*

    Describes properties of a particle, a private variable. Both the emitter and collection functions interact with it.

     */
    var particle = {
        weight: 0,
        direction : 0,
        origin: {
            x: 0,
            y: 0
        },
        position : {
            x: 0,
            y: 0
        },
        speed: {
            x: 0,
            y: 0
        },
        color : "",
        size: {
            height: 0,
            width: 0
        },
        sprite: false,
        shape: false,
        alpha: 0,
        decay: 0
    };

    /*

    A collection holds an array of particles and contains functions to preform actions on them

     */
    var collection = function(emitter){
        if(typeof emitter === 'undefined'){
            throw new Error("Emitter needs to be passed to a collection")
        }

        var particleProps = emitter.particle,
            emitterFunction = emitter.behavior,
            particleArr = [];

        return {
            addParticle : function(p){
                particleArr.push(p);
            },
            numParticles : function(){
                return particleArr.length;
            },
            draw : function(){
                for(var i = 0, j = particleArr.length, particle; particle = particleArr[i]; i++){
                    //move particle
                    particle.position.x += particle.speed.x * Math.cos(particle.direction);
                    particle.position.y -= particle.speed.y * Math.sin(particle.direction);
                    //get particle distance from origin
                    var diffX = particle.position.x - particle.origin.x,
                        diffY = particle.position.y - particle.origin.y,
                        distance = Math.sqrt((diffX*diffX)+(diffY*diffY));
                    //decay particle
                    particle.alpha = 1 - (distance / particle.decay);
                    if(particle.alpha <= 0){
                        particleArr.splice(i, 1);
                    }
                    //draw particle
                    //todo: shape, sprite
                    context.fillStyle = particle.color;
                    context.beginPath();
                    context.arc(
                        particle.x,
                        particle.y,
                        particle.size,
                        0,
                        Math.PI*2,
                        true
                    );
                    context.fill();
                }
            }
        };
    };

    /*

    An emitter describes the behavior of individual particles

     */
    var emitter = function(p, e){
        var type, emit;

        if(typeof p === 'string'){
            //user supplied a string, look for a pre-defined particle
            type = particleTypes[p];
            if(typeof type === 'undefined'){
                throw new Error(p+" Does not exist");
            }
        }
        else if(typeof p === 'undefined'){
            //pointless to instantiate further, the default particle object has no usable properties
            throw new Error("Undefined particle type");
        }
        else{
                //For now we'll assume that the user supplied an object, todo: more strict type checking
                //we extend the user supplied object into the particle object to at least ensure that all the defaults are there todo: validate this particle
                //we extend this object into a new object to so that the defaults aren't altered and we're dealing with a fresh object and not a reference.
                type = extend({}, particle, p);
        }

        if(typeof e === 'string'){
            //look for a pre defined emitter
            emit = emitterFunctions[e];
            if(typeof emit === 'undefined'){
                throw new Error(e+" Does not exist");
            }
        }
        else if( typeof e === 'undefined' || e !== 'function'){
            //without an emitter function, the particle behavior is not defined
            throw new Error('Undefined emitter function');
        }else{
            emit = e;
        }


        return {
            particle: type,
            behavior: emit
        };
    };



    /*
    Limit access to the inside functions
     */
    return {
        collection : collection,
        emitter : emitter
    }
};

// Version.
particles.VERSION = '0.1.0';


// Export to the root, which is probably `window`.
root.particles = particles;