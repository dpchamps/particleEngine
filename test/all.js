module( "Tests for the base particles function",{
    beforeEach : function(){
        //create a context to initialize the particles function
        this.context = document.createElement('canvas').getContext('2d');
    }

});
test("correct instantiation of the particles function", function(assert){
    ok(particles, "The base function exists");
    assert.throws(
        function(){
            particles();
        },
        "Throws an error on calling the function without any params"
    );
    assert.throws(
        function(){
            particles({});
        },
        "Throws an error upon calling the function with something other than a CanvasRenderingContext2D"
    );
    assert.ok(particles(this.context),
        "Returns without error when passed a canvas 2d context"
    );

    //ok(particles(this.context));
});
module("Top level engine tests", {

});
test("Engine functions", function(){
    var context = document.createElement('canvas').getContext('2d'),
        engine = particles(context);
    ok(engine.collection, "The collection function exists");
    ok(engine.emitter, "The emitter function exists");
    ok(engine.updateContext, "The updateContext function exists")
});

/*
tests for particles.collection
 */
module( "Collection Tests",{
    beforeEach : function(){
        //create a context to initialize the particles function
        var context = document.createElement('canvas').getContext('2d');
            this.engine = particles(context);
            this.emitter = this.engine.emitter('flame');
            this.collection = this.engine.collection;
            this.dummyCol = this.engine.collection(this.emitter);
    }
});
test("Collection Initialization", function(assert){
   assert.throws(
       function(){
          this.collection()
       },
       "Throws an error when calling the collection function without an emitter"
   );
    assert.ok(this.collection(this.emitter), "collection returns properly when passed an emitter");
});
test("collection.properties", function(assert){
    var args = {
        max : 500,
        cycleOnce: true,
        density: 20
    };
    var col1 = this.engine.collection(this.emitter, args);
    var col2 = this.engine.collection(this.emitter);
    col2.properties.max = 5;
    assert.ok(col1.properties, "the properties object exists");
    assert.strictEqual(col1.properties.max, args.max, "collection max property can be replaced");
    assert.strictEqual(col1.properties.cycleOnce, args.cycleOnce, "collection cycleOnce property can be replaced");
    assert.strictEqual(col1.properties.density, args.density, "collection density property can be replaced");
    assert.strictEqual(col2.properties.max,5, "a new collection property can be assigned after initilization");
    assert.notStrictEqual(col2.properties.max, col1.properties.max, "seperate collections can have different properties");
    assert.notDeepEqual(col1.properties, col2.properties, 'seperate collections are different objects');

});
test('collection.emitter', function(assert){
    var col1 = this.collection(this.emitter);
    this.emitter.properties.height = 100;
    assert.notDeepEqual(col1.emitter, this.emitter, "The collection emitter is a new object");
});
test('collection.exportParticle', function(assert){
    assert.strictEqual(typeof this.dummyCol.exportParticle(), 'string', "Export particle returns a string");
    var obj = JSON.parse(this.dummyCol.exportParticle());
    assert.strictEqual(typeof obj, 'object', "The exported string is valid JSON");
    assert.ok(obj.direction, "The parsed string has a particle property");
    this.dummyCol.emitter.particle.speed.x = 100;
    var obj2 =  JSON.parse(this.dummyCol.exportParticle());
    assert.strictEqual(obj2.speed.x, 100, "The exported JSON reflects changes made to collection.emitter.particle properties");

});
test('collection.cycle', function(assert){
    this.dummyCol.properties.density = 5;
    this.dummyCol.cycle();
    assert.strictEqual(this.dummyCol.numParticles(), 5, "Calling cycle on a collection with a density of 5 results in five particles in it's particle array");
    this.dummyCol.cycle();
    assert.strictEqual(this.dummyCol.numParticles(), 10, "Calling cycle again results in in ten particles in the particle array");
    this.dummyCol.properties.stopped = true;
    this.dummyCol.cycle();
    assert.strictEqual(this.dummyCol.numParticles(), 10, "Calling cycle after setting the stopped property to true does not add any more particles");
    this.dummyCol.properties.stopped = false;
    this.dummyCol.properties.finished = true;
    this.dummyCol.cycle();
    assert.strictEqual(this.dummyCol.numParticles(), 10, "Calling cycle after setting the finished property to true does not add any more particles");
    this.dummyCol.properties.finished = false;
    this.dummyCol.properties.max = 10;
    this.dummyCol.cycle();
    assert.strictEqual(this.dummyCol.numParticles(), 10, "When the number of particles has reached the collection's max property, cycle does not add more particles");
    this.dummyCol.properties.max = 15;
    assert.strictEqual(this.dummyCol.numParticles(), 10, "Adjusting the max property on the fly does not allow the cycle to add more particles.");


});
