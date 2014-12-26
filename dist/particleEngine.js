(function(root, undefined) {

  "use strict";


/* particleEngine main
*
* Notes, in the form of a todo checklist
*
* todo: decouple collection from emitter, make all variables editable
* todo: remove unnecessary variables and code that was added to find the infamous extend bug
* todo: add a 'continuous' variable, self explanatory
* todo: using dat GUI, make an 'exportParticle' for ease of creating particles and emitters... a sort of "particle creator" perhaps... yes...
*
* */

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
     An extend function, makes deep copies
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
    //turn hex to rgb, this is necessary for DAT gui, there's some kind of bug that causes it to assign a color to a hex value sometimes
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    //A min / max random generator
    function minMax(min, max){
        return (min) + (Math.random() * (max - min));
    }
    function particleVariation(particle){
        particle.direction = minMax(particle.direction, particle.spread);

        particle.speed.x += Math.random()*particle.speed.spread;
        particle.speed.y += Math.random()*particle.speed.spread;

        particle.size.x += Math.random()*particle.size.spread;
        particle.size.y += Math.random()*particle.size.spread;

        //for a dat gui bug
        if(typeof particle.color === 'string'){
            var colors = hexToRgb(particle.color);
            particle.color = [colors.r, colors.g, colors.b];
        }
        particle.color = particle.color.map(Math.floor);

        return particle;
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
                    //if(this.numParticles() >= this.properties.max){
                    //    this.properties.finished = true;
                    //}
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
        test : {
                direction: (7*Math.PI)/4,
                spread: (5*Math.PI)/4,
                color: [0,0,0],
                speed: {
                    x: 0.5,
                    y: 0.5,
                    spread: 2
                },
                alpha: 1,
                size: {
                    x: 1,
                    y: 1,
                    spread: 4
                },
                decay: Math.sqrt( (_context.canvas.width*_context.canvas.width)+(_context.canvas.height*_context.canvas.height) ) / 2
        }
    };

    /*

     Describes properties of a particle, a private variable. Both the emitter and collection functions interact with it.

     */
    var particle = {
        weight: 0, //not implemented
        direction : 0,
        spread: 0,
        position : {
            x: 0,
            y: 0
        },
        speed: {
            x: 0,
            y: 0,
            spread: 0
        },
        color : [],
        size: {
            height: 0,
            width: 0,
            spread: 0
        },
        sprite: false, //not implemented
        shape: false,  //not implemented
        alpha: 0,
        decay: 0
    };

    var collectionDefaults = {
        max: 100 ,
        density: 1,
        cycleOnce: false,
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


        var particleArr = [],
            properties = extend({}, collectionDefaults, args);


        return {
            properties : properties,
            emitter : emitter,
            cycle : function(){
                var i = 0;
                if(this.numParticles()<this.properties.max && this.properties.finished === false){
                    while(i++ < this.properties.density ){
                        this.addParticle();
                        if(this.numParticles() >= this.properties.max && this.properties.cycleOnce){
                            this.properties.finished = true;
                        }
                    }
                }
            },
            reset : function(){
                particleArr = [];
                _context.clearRect(0,0,_context.canvas.width, _context.canvas.height);
                this.properties.finished = false;
            },
            addParticle : function(){
                //only add more particles if the collection isn't stopped
                if(this.properties.stopped === false){
                    var _particle = extend({}, particle, emitter.particle);
                    //this is where we give particles the variation through all of the various spreads
                    _particle = particleVariation(_particle);
                    //place particle based on emitter height / width
                     var org = {
                            x: minMax(emitter.properties.origin.x, emitter.properties.origin.x + emitter.properties.width),
                            y: minMax(emitter.properties.origin.y, emitter.properties.origin.y + emitter.properties.height)
                        };
                    extend(_particle.position, org);

                    particleArr.push(_particle);
                }
            },
            numParticles : function(){
                return particleArr.length;
            },
            draw : function(){
                this.cycle();
                //This is an optimized for loop:
                // http://jsperf.com/for-loops22/2
                    for(var i = 0, j = particleArr.length, particle; particle = particleArr[i]; i++){//jshint ignore:line
                        //move particle
                        particle.position.x += (particle.speed.x) * Math.cos(particle.direction);
                        particle.position.y -= (particle.speed.y) * Math.sin(particle.direction);

                        //get particle distance from origin
                        var diffX = particle.position.x - (emitter.properties.origin.x + emitter.properties.width),
                            diffY = particle.position.y - (emitter.properties.origin.y + emitter.properties.height),
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
                            (particle.size.x * particle.size.y /2),
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
    var emitter = function(p, properties){
        var props = {
            origin : {
                x: 0,
                y: 0
            },
            height : 1,
            width:1
        },
        cycle = function(){

        },
        type;
        //
        extend({}, props, properties);
        if(typeof p === 'string'){
            //user supplied a string, look for a pre-defined particle
            type = particleTypes[p];
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

        return {
            properties : props,
            particle: type,
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
