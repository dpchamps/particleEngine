/* particleEngine main */

var document = root.document || {};

var particleEngine = function(args) {
    /*
     validation method, expects type object:
     {
     dir: direction in radians,
     speed,
     alpha,
     size
     }
     */
    function validParticle(o){
        if(typeof o !== 'object'){
            throw new Error(o + "Invalid type");
        }

        //make sure that all properties are present, and do some loose validation on each type.
        //  wrong properties will break the engine
        var validate = {
            dir : 'number',
            speed : 'object',
            alpha : 'number',
            size : 'number'
        };
        for(var i = 0; i < validate.length; i++){
            var prop = validate[i];
            if(!o.hasOwnProperty(prop)){
                throw new Error("Missing "+ prop + " from " + o);

            }
            if(o.hasOwnProperty(prop) && typeof o[prop] !== 'number'){
                throw new Error("Invalid type for "+prop+". Expected 'number', received "+ typeof prop);
            }
        }

        return o;
    }
    //basic extend function to clean this code up a bit
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
    function step(context){

    }
    //this gets extended when a new cluster is created
    var particleSetBase = {
        max : 100,
        density: 10,
        gravity: {
            cur: 0,
            step: 0.1,
            max: 1.2
        },
        origin: {},
        color : [],
        particles : [],
        degradeRate: 0,
        finishFlag: false,
        emitter : function(){
            //dummy function
        },
        numParticles : function(){
            return this.particles.length;
        },
        addParticle : function(p){
            //validate the particle
            try{
                validParticle(p);
                p.x = this.origin.x;
                p.y = this.origin.y;
                this.particles.push(p);
            }catch (e){
                console.log(e);
            }
        },
        //step through cluster, i.e: move particles in cluster
        //  fills canvas as well (for now) decouple this
        step : function(context){
            for(var i = 0; i < this.numParticles(); i++){
                var particle = this.particles[i];

                //get distance from origin
                var diffX = particle.x - this.origin.x;
                var diffY = particle.y - this.origin.y;
                var dis = Math.sqrt((diffX*diffX)+(diffY*diffY));
                //move particles based on rads

                particle.x += particle.speed.x * Math.cos(particle.dir);
                //adjust for gravity
                if(this.gravity.cur < this.gravity.max){
                    this.gravity.cur += this.gravity.step;
                    particle.speed.y += this.gravity.cur;
                }
                particle.y -= particle.speed.y * Math.sin(particle.dir);

                //adjust based on alpha
                particle.alpha = 1 - (dis/this.degradeRate);

                //adjust based on size
                if(particle.alpha <= 0.4){
                    particle.size = particle.size - 0.01;
                }

                if(particle.alpha <= 0 || particle.size <= 0){
                    this.particles.splice(i, 1);
                    continue;
                }

                context.fillStyle = 'rgba('+this.color +','+particle.alpha+')';
                //console.log(context.fillStyle);
                context.beginPath();

                context.arc(particle.x, particle.y, particle.size, 0, Math.PI*2, true);
                context.closePath();
                context.fill();
            }
        }
    };

    return{
        //returns an object for interacting with a set of particles
        particleSet : function(args){
            //required parameters
            if(typeof args.origin === 'undefined'){
                throw new Error("particleSet requires origin parameter");
            }
            if(typeof args.color === 'undefined'){
                throw new Error("particleSet requires color parameter");
            }
            if(typeof args.degradeRate === 'undefined'){
                throw new Error("particleSet requires degradeRate parameter");
            }

            //join color
            args.color = args.color.join();
            return extend(particleSetBase, args);
        }

    };

};

// Version.
particleEngine.VERSION = '0.1.0';


// Export to the root, which is probably `window`.
root.particleEngine = particleEngine;