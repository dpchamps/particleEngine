/**
 * Created by Dave on 12/30/2014.
 */
/*
 particles.collection

 These are access / primary functions for interacting with the collection's private variables

 test these first, as other units will use them in thier own tests.
 */
module("Collection -- access && primary functions", {
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
test("collection.addParticle", function(assert){
    var collection = this.dummyCol;
    collection.addParticle();
    assert.strictEqual(collection.numParticles(), 1, "Add particle pushes a particle onto the collection's array");
});
test("collection.getParticle", function(assert){
    var collection = this.dummyCol;
    collection.addParticle();
    var particle = collection.getParticle(0);
    assert.ok(particle, "getParticle returns an object from the collection's array");
    particle.direction = 100;
    particle = collection.getParticle(0);
    assert.strictEqual(particle.direction, 100, "Individual particle properties can be modified by using getParticle()");
});
test("collection.numParticles", function(assert){
    var collection = this.dummyCol;
    assert.strictEqual(collection.numParticles(), 0, "numParticles() returns the correct number of particles in the collection's array");
    collection.addParticle();
    collection.addParticle();
    collection.addParticle();
    assert.strictEqual(collection.numParticles(), 3, "numParticles() returns the correct number as the collection's array increases");
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
test("collection.setProp", function(assert){
    var collection = this.dummyCol;
    collection.setProp("density", 50);
    assert.strictEqual(collection.properties.density, 50, "setProp successfully sets a collection's property");
    collection.setProp('cycleOnce', true);
    collection.setProp('finished', true);
    collection.setProp('cycleCount', 100);
    collection.setProp('max', 500);
    assert.strictEqual(collection.properties.finished, false, "setting max property greater than cycleCount  when cycleOnce && finished are true results in the collesction's finished property being set to false");
});
test("collection.getProp", function(assert){
    var collection = this.dummyCol;
    collection.properties.max = 1;
    assert.strictEqual(collection.getProp('max'), 1, "getProp successfully returns the value of a collection's property")
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
/*

 The functions that interact with private variables / require the use of access functions

 */
module( "Collection -- interaction functions",{
    beforeEach : function(){
        //create a context to initialize the particles function
        var context = document.createElement('canvas').getContext('2d');
        this.engine = particles(context);
        this.emitter = this.engine.emitter('flame');
        this.collection = this.engine.collection;
        this.dummyCol = this.engine.collection(this.emitter);
    }
});




test('collection.cycle', function(assert){
    this.dummyCol.properties.density = 5;
    this.dummyCol.cycle();
    assert.strictEqual(this.dummyCol.numParticles(), 5, "Calling cycle on a collection with a density of 5 results in five particles in it's particle array");
    this.dummyCol.cycle();
    assert.strictEqual(this.dummyCol.numParticles(), 10, "Calling cycle again results in in ten particles in the particle array");
    this.dummyCol.properties.finished = true;
    this.dummyCol.cycle();
    assert.strictEqual(this.dummyCol.numParticles(), 10, "Calling cycle after setting the finished property to true does not add any more particles");
    this.dummyCol.properties.finished = false;
    this.dummyCol.setProp('max', 10);
    this.dummyCol.cycle();
    assert.strictEqual(this.dummyCol.numParticles(), 10, "When the number of particles has reached the collection's max property, cycle does not add more particles");
    this.dummyCol.setProp('max', 15);
    assert.strictEqual(this.dummyCol.numParticles(), 10, "Adjusting the max property on the fly allows the cycle to add more particles.");
    this.dummyCol.reset();
    this.dummyCol.setProp('cycleOnce', true);
    this.dummyCol.setProp('max', 10);
    this.dummyCol.cycle();
    assert.strictEqual(this.dummyCol.getProp('cycleCount'), 5, "cycleCount increases when cyclOnce is set to true");
    this.dummyCol.cycle();
    this.dummyCol.cycle();
    assert.strictEqual(this.dummyCol.getProp('cycleCount'), 10, "cycleCount does not increase passed max property.")
    assert.strictEqual(this.dummyCol.getProp('finished'), true, "when cycleOnce is set to true and cycleCount equal max property, the collection has finished.");
});
test("collection.reset", function(assert){
    this.dummyCol.setProp('density', 10);
    this.dummyCol.setProp('max', 10);
    this.dummyCol.cycle();
    this.dummyCol.reset();
    assert.strictEqual(this.dummyCol.numParticles(), 0, "reset clears the particle array");
    assert.strictEqual(this.dummyCol.getProp('finished'), false, "reset sets finished property to false");
});
test("collection.draw", function(assert){
    var collection = this.dummyCol;
    collection.draw();
    var posX = collection.getParticle(0).position.x;
    collection.draw();
    assert.notStrictEqual(posX, collection.getParticle(0).position.x, "Each call to draw changes a particle from it's previous state");
    collection.setProp('stopped', true);
    posX = collection.getParticle(0).position.x;
    collection.draw();
    assert.strictEqual(posX, collection.getParticle(0).position.x,"If the collection is stopped, draw does not alter a particle");
});
