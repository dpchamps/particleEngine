/**
 * Created by Dave on 12/30/2014.
 */

/*
particles.emitter
 */

module("Emitter", {
    beforeEach : function(){
        //create a context to initialize the particles function
        var context = document.createElement('canvas').getContext('2d');
        this.engine = particles(context);
        this.emitter = this.engine.emitter('flame');
    }
});
test("Emitter Initialization", function(assert){
    var emit = this.engine.emitter;
    assert.throws(
        function(){
            emit();
        },
        "Throws an error when trying to initialize an emitter without a param"
    );
    assert.throws(
        function(){
            emit('a nonsense string');
        },
        "Throws an error if a predefined particle cannot be found"
    );
    assert.ok(emit('flame'), "Returns when a predefined particle is found");

    var obj = {"weight":0,"direction":3.949863863620736,"spread":5.474372723263827,"position":{"x":0,"y":0},"speed":{"x":0.6,"y":0.6,"spread":0.4},"gravity":0,"gravityCount":0,"color":"#ffffff","size":{"height":0,"width":0,"spread":2,"x":2.5,"y":2},"sprite":false,"shape":false,"alpha":1,"decay":449};
    var e1 = emit(obj);
    assert.ok(e1, "Returns when passed an object that defines a particle");
    assert.strictEqual( e1.particle.speed.x, 0.6, "Emitter particle properties are set correctly" );
    obj.speed.x = 1000;
    assert.notStrictEqual(e1.particle.speed.x, obj.speed.x, "Emitter particle is a copy of the object passed in initialization");
    assert.ok(emit({}), "Returns when passed an empty object");
    var props = {
        height: 100,
        width: 20
    };
    var e2 = emit({}, props);
    assert.strictEqual(e2.properties.height, 100, "Properties passed on initialization are set properly");
    assert.strictEqual(e2.properties.width, 20, "Properties passed on initialization are set properly");
    props.height = 5000;
    assert.notStrictEqual(e2.properties.height, props.height, "Emitter properties are a copy of the object passed.");

});
test("emitter.properties", function(assert){
    var emitter = this.emitter;
    assert.strictEqual(emitter.properties.height, 1, "An emitter property can be accessed");
    emitter.properties.height = 500;
    assert.strictEqual(emitter.properties.height, 500, "An emitter property can be altered");
    emitter.properties.origin.x = 300;
    assert.strictEqual(emitter.properties.origin.x, 300, "A nested object in an emitter property can be altered");
});
test("emitter.setOrigin", function(assert){
    var emitter = this.emitter;
    emitter.setOrigin(500, 300);
    assert.strictEqual(emitter.properties.origin.x, 500, "setOrigin successfully sets the emitter's origin.x property");
    assert.strictEqual(emitter.properties.origin.y, 300, "setOrigin successfully sets the emitter's origin.y property");
});
test("emitter.setParticle", function(assert){
    var emitter = this.emitter,
        particle = {"weight":0,"direction":1.1780295733605703,"spread":1.8016922886691076,"position":{"x":0,"y":0},"speed":{"x":0.79,"y":0.6,"spread":0.4},"gravity":0,"gravityCount":0,"color":[23.455882352941163,25.596885813148777,27.499999999999986],"size":{"height":0,"width":0,"spread":3.3672395650648896,"x":2.244826376709926,"y":1.122413188354963},"sprite":false,"shape":false,"alpha":0.24263312079958643,"decay":295};
    emitter.setParticle(particle);
    assert.deepEqual(emitter.particle, particle, "setParticle successfully changes the emitters particle property");
    particle.speed.x = 1000;
    assert.notDeepEqual(emitter.particle, particle, "particles are set by copy, not reference");
});