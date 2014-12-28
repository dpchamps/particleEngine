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
        var context = document.createElement('canvas').getContext('2d'),
            engine = particles(context),
            emitter = engine.emitter('flame'),
            collection = engine.collection;
    }
});
test("Collection Error", function(assert){
   assert.throws(
       function(){
          collection()
       },
       "Throws an error when calling the collection function without an emitter"
   );
});
test("Collection Initializtion", function(assert){
   ok(collection(emitter), "collection returns properly when passed an emitter");
});
