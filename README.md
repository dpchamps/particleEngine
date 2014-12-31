# particleEngine

## About
A relatively lightweight library for creating particle effects

## Installation
`<script src=./path/to/particleEngine.min.js>`

## How do I use this?!

###engine
create a new engine and bind a CanvasRenderingContext2D

    var context = document.getElementById('canvas').getContext('2d');
    var engine = particles(context);
###engine.emitter
    engine.emitter([string | object], [optional object]);
parameter1 = a string of the name of a predefined particle, or an object representing a particle

parameter2 (optional) = an object that overrides the emitters default properties

see /docs/particleEngine.html#section-12 for particle attributes

see /docs/particleEngine.html#section-xx for emitter property defaults
###engine.collection
    engine.collection(emitter, [optional object])

parameter1 = an emitter object
parameter2 (optional) = an object that overrides the collection's default properties.

###engine.collection.draw()
    someKindOfDrawLoop(){ //usually requestAnimationFrame
        collection.draw();
    }

##Make Particle Objects

you can export a json object with the particle creator here: demo/index.html


## Documentation

Start with `docs/particleEngine.html`.



## License

MIT. See `LICENSE.txt` in this directory.
