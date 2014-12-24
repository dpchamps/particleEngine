(function(root, undefined) {

  "use strict";


/* particleEngine main */

var document = root.document || {};

var particles = function(context) {
    /*
     todo: let's make sure this is actually a canvas 2d context
     */
    if(typeof context === 'undefined'){
        throw new Error('particles must be defined with a canvas context');
    }
    //internal context
    var _context = context;
    /*
     An extend function
     */
    function extend(dest, sources){
        var args = Array.prototype.slice.call(arguments);
        for(var i = 1; i < args.length; i++){
            for(var key in args[i]){
                if(args[i].hasOwnProperty(key)){
                    if(typeof args[i][key] === 'object' && (args[i][key] instanceof Array) === false){
                        dest[key] = {};
                        extend(dest[key], args[i][key]);
                    }else{
                        dest[key] = args[i][key];
                    }
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
        },
        test : function(){
            var i = 0;

             if(this.numParticles()<this.properties.max && this.properties.finished === false){
                 while(i++ < this.properties.density ){
                    this.addParticle();

                 }

             }else{

             }

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

        },
        test : function(){
            return {
                direction: (5*Math.PI)/4 + (Math.random()*((7*Math.PI)/4 - (5*Math.PI)/4)),
                color: [0, 0, 0],
                speed: {
                    x: (Math.random()*2)+2,
                    y: (Math.random()*2)+2
                },
                alpha: 1,
                size: Math.random()*10,
                decay: Math.sqrt( (_context.canvas.width*_context.canvas.width)+(_context.canvas.height*_context.canvas.height) ) / 2
            };
        }
    };

    /*

     Describes properties of a particle, a private variable. Both the emitter and collection functions interact with it.

     */
    var particle = {
        weight: 0,
        direction : 0,
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

    var collectionDefaults = {
        max: 500 ,
        density: 1,
        finished : false,
        stopped: false
    };

    /*

     A collection holds an array of particles and contains functions to preform actions on them

     */
    var collection = function(emitter, args){
        if(typeof emitter === 'undefined'){
            throw new Error("Emitter needs to be passed to a collection");
        }
        //where args can override max, and density
        var particleProps = particleTypes[emitter.getParticle],
            emitterProps = emitter.properties,
            emitterFunction = emitterFunctions[emitter.behavior],
            particleArr = [],
            properties = extend({}, collectionDefaults, args);

        return {
            __testReturnArr : function(){
                return particleArr;
            },
            arr : particleArr,
            properties : properties,
            emitter : emitter,
            emitterFunction : emitterFunction,
            addParticle : function(p){
                //only add more particles if the collection isn't stopped
                if(this.properties.stopped === false){
                    p = p || {};
                    var _particle = extend({}, particle, particleProps(), p);
                    _particle.position.x = this.emitter.properties.origin.x;
                    _particle.position.y = this.emitter.properties.origin.y;
                    particleArr.push(_particle);
                }
            },
            numParticles : function(){
                return particleArr.length;
            },
            draw : function(){
                this.emitterFunction();
                //This is an optimized for loop:
                // http://jsperf.com/for-loops22/2

                    for(var i = 0, j = particleArr.length, particle; particle = particleArr[i]; i++){//jshint ignore:line
                    //for(var i = 0; i < this.numParticles(); i++){
                        //var particle = particleArr[i];
                        //move particle

                        particle.position.x += particle.speed.x * Math.cos(particle.direction);
                        particle.position.y -= particle.speed.y * Math.sin(particle.direction);

                        //get particle distance from origin
                        var diffX = particle.position.x - emitter.properties.origin.x,
                            diffY = particle.position.y - emitter.properties.origin.y,
                            distance = Math.sqrt((diffX*diffX)+(diffY*diffY));
                        //decay particle

                        particle.alpha = 1 - (distance / particle.decay);

                        if(particle.alpha <= 0){
                            particleArr.splice(i, 1);
                        }
                        //draw particle
                        //todo: shape, sprite
                        _context.fillStyle = "rgba("+particle.color.join()+","+particle.alpha +")";

                        _context.beginPath();
                        _context.arc(
                            particle.position.x,
                            particle.position.y,
                            particle.size,
                            0,
                                Math.PI*2,
                            true
                        );
                        _context.closePath();
                        _context.fill();
                    }
            }
        };
    };

    /*

     An emitter describes the behavior of individual particles

     */
    var emitter = function(p, e, properties){
        var props = {
            origin : {
                x: 0,
                y: 0
            },
            height : 0,
            width:0
        },
            type, emit;
        //
        extend({}, props, properties);
        if(typeof p === 'string'){
            //user supplied a string, look for a pre-defined particle
            type = p;
            if(typeof particleTypes[p] === 'undefined'){
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
            type = p;
        }

        if(typeof e === 'string'){
            //look for a pre defined emitter
            emit = e;
            if(typeof emitterFunctions[e] === 'undefined'){
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
            properties : props,
            getParticle: type,
            behavior: emit,
            setOrigin: function(x,y){
                this.properties.origin.x = x;
                this.properties.origin.y = y;
            }
        };
    };

    /*
     Limit access to the inside functions
     */
    return {
        collection : collection,
        emitter : emitter,
        updateContext : function(context){
            _context = context;
        }
    };
};

// Version.
particles.VERSION = '0.1.0';

// Export to the root, which is probably `window`.
root.particles = particles;

}(this));
