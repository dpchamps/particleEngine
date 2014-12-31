# particleEngine

## About
A relatively lightweight library for creating particle effects

## Installation
`<script src=./path/to/particleEngine.min.js>`

## Usage

###engine
create a new engine and bind a CanvasRenderingContext2D

    var context = document.getElementById('canvas').getContext('2d');
    var engine = particles(context);
###emitter
create an emitter. 

    var emitter = engine.emitter('water');

the parameters for the emitter are as follows:

    engine.emitter([string | object], [optional object]);
parameter1 = a string of the name of a predefined particle, or an object representing a particle

parameter2 (optional) = an object that overrides the emitters default properties

see /docs/particleEngine.html#section-12 for particle attributes

see /docs/particleEngine.html#section-xx for emitter property defaults
###collection
create a collection, and bind it to an emitter

    var collection = engine.collection(emitter);
    
the parameters for a collection are as follows:

    engine.collection(emitter, [optional object])

parameter1 = an emitter object
parameter2 (optional) = an object that overrides the collection's default properties.

##Make it work

    someKindOfDrawLoop(){ //usually requestAnimationFrame
        collection.draw();
    }




## Documentation

Start with `docs/particleEngine.html`.



## License

MIT. See `LICENSE.txt` in this directory.
