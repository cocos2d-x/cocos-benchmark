/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var TAG_INFO_LAYER = 1;
var TAG_PARTICLE_SYSTEM = 3;
var TAG_LABEL_ATLAS = 4;
var PARTICLE_NODES = 100;
var VALID_DELTA_RATE = 0.3;

////////////////////////////////////////////////////////
//
// ParticleMainScene
//
////////////////////////////////////////////////////////
var ParticleMainScene = BenchmarkBaseTestScene.extend({
    _lastRenderedCount:null,
    _quantityParticles:null,
    _subtestNumber:null,
    initWithSubTest:function (asubtest, particles) {
        this._subtestNumber = asubtest;
        var s = cc.Director.getInstance().getWinSize();

        this._lastRenderedCount = 0;
        this._quantityParticles = particles;

        if (BenchmarkConfig.DEBUG) {
            var infoLabel = cc.LabelTTF.create("0 nodes", "Marker Felt", 30);
            infoLabel.setColor(cc.c3b(0, 200, 20));
            infoLabel.setPosition(cc.p(s.width / 2, s.height - 90));
            this.addChild(infoLabel, 1, TAG_INFO_LAYER);

            // particles on stage
            var labelAtlas = cc.LabelTTF.create("0000", "Marker Felt", 30);
            this.addChild(labelAtlas, 0, TAG_LABEL_ATLAS);
            labelAtlas.setPosition(cc.p(s.width - 66, 50));

            var label = cc.LabelTTF.create(this.title(), "Arial", 40);
            this.addChild(label, 1);
            label.setPosition(cc.p(s.width / 2, s.height - 32));
            label.setColor(cc.c3b(255, 255, 40));

            this.updateQuantityLabel();
        }
        this.createParticleSystem();

        this.schedule(this.step);
    },
    step:function () {
        if (BenchmarkConfig.DEBUG) {
            var atlas = this.getChildByTag(TAG_LABEL_ATLAS);
            var emitter = this.getChildByTag(TAG_PARTICLE_SYSTEM);
           
            var str = emitter.getParticleCount();

            atlas.setString(str);
        }
    },
    createParticleSystem:function () {
        var particleSystem;

        /*
         * Tests:
         * 1 Quad Particle System using 32-bit textures (PNG)
         * 2: Quad Particle System using 16-bit textures (PNG)
         * 3: Quad Particle System using 8-bit textures (PNG)
         * 4: Quad Particle System using 4-bit textures (PVRTC)
         */
        if (this.getChildByTag(TAG_PARTICLE_SYSTEM)) {
            this.removeChildByTag(TAG_PARTICLE_SYSTEM, true);
        }
        //todo
        // remove the "fire.png" from the TextureCache cache.
        var texture = cc.TextureCache.getInstance().addImage("res/Images/fire.png");
        cc.TextureCache.getInstance().removeTexture(texture);

        particleSystem = new APIWrapper.ParticleSystem();

        switch (this._subtestNumber) {
            case 1:
                cc.Texture2D.setDefaultAlphaPixelFormat(cc.TEXTURE_2D_PIXEL_FORMAT_RGBA8888);
                particleSystem.initWithTotalParticles(this._quantityParticles);
                particleSystem.setTexture(cc.TextureCache.getInstance().addImage("res/Images/fire.png"));
                break;
            case 2:
                cc.Texture2D.setDefaultAlphaPixelFormat(cc.TEXTURE_2D_PIXEL_FORMAT_RGBA4444);
                particleSystem.initWithTotalParticles(this._quantityParticles);
                particleSystem.setTexture(cc.TextureCache.getInstance().addImage("res/Images/fire.png"));
                break;
            case 3:
                cc.Texture2D.setDefaultAlphaPixelFormat(cc.TEXTURE_2D_PIXEL_FORMAT_A8);
                particleSystem.initWithTotalParticles(this._quantityParticles);
                particleSystem.setTexture(cc.TextureCache.getInstance().addImage("res/Images/fire.png"));
                break;
            default:
                particleSystem = null;
                cc.log("Shall not happen!");
                break;
        }
        this.addChild(particleSystem, 0, TAG_PARTICLE_SYSTEM);

        this.doTest();

        // restore the default pixel format
        cc.Texture2D.setDefaultAlphaPixelFormat(cc.TEXTURE_2D_PIXEL_FORMAT_RGBA8888);
    },
    updateQuantityLabel:function () {
        if (BenchmarkConfig.DEBUG) {
            if (this._quantityParticles != this._lastRenderedCount) {
                var infoLabel = this.getChildByTag(TAG_INFO_LAYER);
                var str = this._quantityParticles + " particles";
                infoLabel.setString(str);

                this._lastRenderedCount = this._quantityParticles;
            }
        }
    },
    getParticlesNum:function () {
        return this._quantityParticles;
    },
    doTest:function () {
    },
    title: function() {
        return 'No title';
    },
    // TODO: find a better way to reduce error by sunzhuoshi
    draw: function() {

    }
});

var ParticleSize4BenchmarkScene = ParticleMainScene.extend({
    runTest:function () {
        this.initWithSubTest(1, PARTICLE_NODES);
        cc.Director.getInstance().replaceScene(this);
    },
    title:function () {
        return "A " + this._subtestNumber + " size=4";
    },
    doTest:function () {
        var s = cc.Director.getInstance().getWinSize();
        var particleSystem = this.getChildByTag(TAG_PARTICLE_SYSTEM);

        // duration
        particleSystem.setDuration(-1);

        // gravity
        particleSystem.setGravity(cc.p(0, -90));

        // angle
        particleSystem.setAngle(90);
        particleSystem.setAngleVar(0);

        // radial
        particleSystem.setRadialAccel(0);
        particleSystem.setRadialAccelVar(0);

        // speed of particles
        particleSystem.setSpeed(180);
        particleSystem.setSpeedVar(50);

        // emitter position
        particleSystem.setPosition(cc.p(s.width / 2, 100));
        particleSystem.setPosVar(cc.p(s.width / 2, 0));

        // life of particles
        particleSystem.setLife(2.0);
        particleSystem.setLifeVar(1);

        // emits per frame
        particleSystem.setEmissionRate(particleSystem.getTotalParticles() / particleSystem.getLife());

        // color of particles
        var startColor = new cc.c4f(0.5, 0.5, 0.5, 1.0);
        particleSystem.setStartColor(startColor);

        var startColorVar = new cc.c4f(0.5, 0.5, 0.5, 1.0);
        particleSystem.setStartColorVar(startColorVar);

        var endColor = new cc.c4f(0.1, 0.1, 0.1, 0.2);
        particleSystem.setEndColor(endColor);

        var endColorVar = new cc.c4f(0.1, 0.1, 0.1, 0.2);
        particleSystem.setEndColorVar(endColorVar);

        // size, in pixels
        particleSystem.setEndSize(4.0);
        particleSystem.setStartSize(4.0);
        particleSystem.setEndSizeVar(0);
        particleSystem.setStartSizeVar(0);

        // additive
        particleSystem.setBlendAdditive(false);
    }
});

var ParticleSize8BenchmarkScene = ParticleMainScene.extend({
    runTest:function () {
        this.initWithSubTest(1, PARTICLE_NODES);
        cc.Director.getInstance().replaceScene(this);
    },
    title:function () {
        return "B " + this._subtestNumber + " size=8";
    },
    doTest:function () {
        var s = cc.Director.getInstance().getWinSize();
        var particleSystem = this.getChildByTag(TAG_PARTICLE_SYSTEM);
        
        // duration
        particleSystem.setDuration(-1);

        // gravity
        particleSystem.setGravity(cc.p(0, -90));

        // angle
        particleSystem.setAngle(90);
        particleSystem.setAngleVar(0);

        // radial
        particleSystem.setRadialAccel(0);
        particleSystem.setRadialAccelVar(0);

        // speed of particles
        particleSystem.setSpeed(180);
        particleSystem.setSpeedVar(50);

        // emitter position
        particleSystem.setPosition(cc.p(s.width / 2, 10));
        particleSystem.setPosVar(cc.p(s.width / 2, 0));

        // life of particles
        particleSystem.setLife(2.0);
        particleSystem.setLifeVar(1);

        // emits per frame
        particleSystem.setEmissionRate(particleSystem.getTotalParticles() / particleSystem.getLife());

        // color of particles
        var startColor = new cc.c4f(0.5, 0.5, 0.5, 1.0);
        particleSystem.setStartColor(startColor);

        var startColorVar = new cc.c4f(0.5, 0.5, 0.5, 1.0);
        particleSystem.setStartColorVar(startColorVar);

        var endColor = new cc.c4f(0.1, 0.1, 0.1, 0.2);
        particleSystem.setEndColor(endColor);

        var endColorVar = new cc.c4f(0.1, 0.1, 0.1, 0.2);
        particleSystem.setEndColorVar(endColorVar);

        // size, in pixels
        particleSystem.setEndSize(8.0);
        particleSystem.setStartSize(8.0);
        particleSystem.setEndSizeVar(0);
        particleSystem.setStartSizeVar(0);

        // additive
        particleSystem.setBlendAdditive(false);
    }
});

var ParticleSize32BenchmarkScene = ParticleMainScene.extend({
    runTest:function () {
        this.initWithSubTest(1, PARTICLE_NODES);
        cc.Director.getInstance().replaceScene(this);
    },
    title:function () {
        return "C " + this._subtestNumber + " size=32";
    },
    doTest:function () {
        var s = cc.Director.getInstance().getWinSize();
        var particleSystem = this.getChildByTag(TAG_PARTICLE_SYSTEM);

        // duration
        particleSystem.setDuration(-1);

        // gravity
        particleSystem.setGravity(cc.p(0, -90));

        // angle
        particleSystem.setAngle(90);
        particleSystem.setAngleVar(0);

        // radial
        particleSystem.setRadialAccel(0);
        particleSystem.setRadialAccelVar(0);

        // speed of particles
        particleSystem.setSpeed(180);
        particleSystem.setSpeedVar(50);

        // emitter position
        particleSystem.setPosition(cc.p(s.width / 2, 100));
        particleSystem.setPosVar(cc.p(s.width / 2, 0));

        // life of particles
        particleSystem.setLife(2.0);
        particleSystem.setLifeVar(1);

        // emits per frame
        particleSystem.setEmissionRate(particleSystem.getTotalParticles() / particleSystem.getLife());

        // color of particles
        var startColor = new cc.c4f(0.5, 0.5, 0.5, 1.0);
        particleSystem.setStartColor(startColor);

        var startColorVar = new cc.c4f(0.5, 0.5, 0.5, 1.0);
        particleSystem.setStartColorVar(startColorVar);

        var endColor = new cc.c4f(0.1, 0.1, 0.1, 0.2);
        particleSystem.setEndColor(endColor);

        var endColorVar = new cc.c4f(0.1, 0.1, 0.1, 0.2);
        particleSystem.setEndColorVar(endColorVar);

        // size, in pixels
        particleSystem.setEndSize(32.0);
        particleSystem.setStartSize(32.0);
        particleSystem.setEndSizeVar(0);
        particleSystem.setStartSizeVar(0);

        // additive
        particleSystem.setBlendAdditive(false);
    }
});

var ParticleSize64BenchmarkScene = ParticleMainScene.extend({
    runTest:function () {
        this.initWithSubTest(1, PARTICLE_NODES);
        cc.Director.getInstance().replaceScene(this);
    },
    title:function () {
        return "D " + this._subtestNumber + " size=64";
    },
    doTest:function () {
        var s = cc.Director.getInstance().getWinSize();
        var particleSystem = this.getChildByTag(TAG_PARTICLE_SYSTEM);

        // duration
        particleSystem.setDuration(-1);

        // gravity
        particleSystem.setGravity(cc.p(0, -90));

        // angle
        particleSystem.setAngle(90);
        particleSystem.setAngleVar(0);

        // radial
        particleSystem.setRadialAccel(0);
        particleSystem.setRadialAccelVar(0);

        // speed of particles
        particleSystem.setSpeed(180);
        particleSystem.setSpeedVar(50);

        // emitter position
        particleSystem.setPosition(cc.p(s.width / 2, 100));
        particleSystem.setPosVar(cc.p(s.width / 2, 0));

        // life of particles
        particleSystem.setLife(2.0);
        particleSystem.setLifeVar(1);

        // emits per frame
        particleSystem.setEmissionRate(particleSystem.getTotalParticles() / particleSystem.getLife());

        // color of particles
        var startColor = new cc.c4f(0.5, 0.5, 0.5, 1.0);
        particleSystem.setStartColor(startColor);

        var startColorVar = new cc.c4f(0.5, 0.5, 0.5, 1.0);
        particleSystem.setStartColorVar(startColorVar);

        var endColor = new cc.c4f(0.1, 0.1, 0.1, 0.2);
        particleSystem.setEndColor(endColor);

        var endColorVar = new cc.c4f(0.1, 0.1, 0.1, 0.2);
        particleSystem.setEndColorVar(endColorVar);

        // size, in pixels
        particleSystem.setEndSize(64.0);
        particleSystem.setStartSize(64.0);
        particleSystem.setEndSizeVar(0);
        particleSystem.setStartSizeVar(0);

        // additive
        particleSystem.setBlendAdditive(false);
    }
});


var ParticleDemo = cc.LayerGradient.extend({
    _emitter: null,

    setColor:function() {},

    ctor:function() {
        this._super();
        cc.associateWithNative( this, cc.LayerGradient );
        this.init();

        this._emitter = null;

        var s = cc.Director.getInstance().getWinSize();
        var label = cc.LabelTTF.create(this.title(), "Arial", 28);
        this.addChild(label, 100, 1000);
        label.setPosition(s.width / 2, s.height - 50);

        if (BenchmarkConfig.DEBUG) {
            var labelAtlas = cc.LabelAtlas.create("0123456789", s_fpsImages, 16, 24, '.');
            this.addChild(labelAtlas, 100, TAG_LABEL_ATLAS);
            labelAtlas.setPosition(s.width - 66, 50);
        }
        this.scheduleUpdate();
    },

    onEnter:function () {
        this._super();
        if (BenchmarkConfig.DEBUG) {
            var pLabel = this.getChildByTag(1000);
            pLabel.setString(this.title());
        }
    },
    title:function () {
        return "No title";
    },

    update:function () {
        if (BenchmarkConfig.DEBUG) {
            if (this._emitter) {
                var atlas = this.getChildByTag(TAG_LABEL_ATLAS);
                atlas.setString(this._emitter.getParticleCount().toFixed(0));
            }
        }
    },
    setEmitterPosition:function () {
        var sourcePos = this._emitter.getSourcePosition();
        if( sourcePos.x === 0 && sourcePos.y === 0)
            this._emitter.setPosition(200,70);
    }
});

var DemoParticleFromFile = ParticleDemo.extend({
    _title:"",
    _emitterPosition: {x: 0, y:0},
    ctor:function(filename, emitterPosition) {
        this._super();
        this._title = filename;
        this._emitterPosition = emitterPosition;
    },
    onEnter:function () {
        this._super();
        this.setColor(cc.c3b(0,0,0));
        var filename = "res/Particles/" + this._title + ".plist";
        this._emitter = APIWrapper.ParticleSystem.create(filename);
        this.addChild(this._emitter, 10);

        if(this._title == "Flower"){
            if(this._emitter.setShapeType)
                this._emitter.setShapeType(cc.PARTICLE_STAR_SHAPE);
        }//else if( this._title == "Upsidedown"){
        //   this._emitter.setDrawMode(cc.PARTICLE_TEXTURE_MODE);
        //}
        this._emitter.setPosition(this._emitterPosition)
    },
    title:function () {
        return this._title;
    }
});

var ParticleBurstPipeBenchmarkScene = BenchmarkBaseTestScene.extend({
    runTest: function () {
        PARTICLE_NODES = 120;
        VALID_DELTA_RATE = 0.4;
        var winSize = cc.Director.getInstance().getWinSize();
        this.addChild(new DemoParticleFromFile("BurstPipe", {x: winSize.width/2, y: winSize.height-50}));
        cc.Director.getInstance().replaceScene(this);
    }
});

var ParticleCometBenchmarkScene = BenchmarkBaseTestScene.extend({
    runTest: function () {
        PARTICLE_NODES = 120;
        VALID_DELTA_RATE = 0.4;
        var winSize = cc.Director.getInstance().getWinSize();
        this.addChild(new DemoParticleFromFile("Comet", {x: winSize.width-60, y: 60}));
        cc.Director.getInstance().replaceScene(this);
    }
});

