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
var TAG_LABEL_ATLAS = 1;

var sceneIdx = -1;
var MAX_LAYER = 33;

var director=null;

var particleSceneArr = [
   
    function () {
        return new DemoParticleFromFile("BurstPipe");
    }
];
/*
var nextParticleAction = function () {
    sceneIdx++;
    sceneIdx = sceneIdx % particleSceneArr.length;
    return particleSceneArr[sceneIdx]();
};

var backParticleAction = function () {
    sceneIdx--;
    if (sceneIdx < 0)
        sceneIdx += particleSceneArr.length;

    return particleSceneArr[sceneIdx]();
};

var restartParticleAction = function () {
    return particleSceneArr[sceneIdx]();
};*/

var ParticleDemo = cc.LayerGradient.extend({
    _emitter: null,
    _background: null,
    _shapeModeButton: null,
    _textureModeButton: null,
    _isPressed:false,

    setColor:function() {},

    ctor:function() {
        this._super();
        cc.associateWithNative( this, cc.LayerGradient );
        this.init( cc.c4b(0,0,0,255), cc.c4b(98,99,117,255));
        this._isPressed = false;

        this._emitter = null;

        // 'browser' can use touches or mouse.
        // The benefit of using 'touches' in a browser, is that it works both with mouse events or touches events
        var t = cc.config.platform;
        if( t == 'browser' || t == 'mobile')  {
            this.setTouchEnabled(true);
        } else if( t == 'desktop' ) {
            this.setMouseEnabled(true);
        }

        var s = director.getWinSize();
        /*
        var label = cc.LabelTTF.create(this.title(), "Arial", 28);
        this.addChild(label, 100, 1000);
        label.setPosition(s.width / 2, s.height - 50);
*/
       /* var tapScreen = cc.LabelTTF.create(this.subtitle(), "Arial", 16);
        tapScreen.setPosition(s.width / 2, s.height - 80);
        this.addChild(tapScreen, 100);*/

        /*var selfPoint = this;
        var item1 = cc.MenuItemImage.create(s_pathB1, s_pathB2, this.backCallback, this);
        var item2 = cc.MenuItemImage.create(s_pathR1, s_pathR2, function () {
            selfPoint._emitter.resetSystem();
        });
        var item3 = cc.MenuItemImage.create(s_pathF1, s_pathF2, this.nextCallback, this);

        var freeBtnNormal = cc.Sprite.create(s_MovementMenuItem, cc.rect(0, 23 * 2, 123, 23));
        var freeBtnSelected = cc.Sprite.create(s_MovementMenuItem, cc.rect(0, 23, 123, 23));
        var freeBtnDisabled = cc.Sprite.create(s_MovementMenuItem, cc.rect(0, 0, 123, 23));

        var relativeBtnNormal = cc.Sprite.create(s_MovementMenuItem, cc.rect(123, 23 * 2, 138, 23));
        var relativeBtnSelected = cc.Sprite.create(s_MovementMenuItem, cc.rect(123, 23, 138, 23));
        var relativeBtnDisabled = cc.Sprite.create(s_MovementMenuItem, cc.rect(123, 0, 138, 23));

        var groupBtnNormal = cc.Sprite.create(s_MovementMenuItem, cc.rect(261, 23 * 2, 136, 23));
        var groupBtnSelected = cc.Sprite.create(s_MovementMenuItem, cc.rect(261, 23, 136, 23));
        var groupBtnDisabled = cc.Sprite.create(s_MovementMenuItem, cc.rect(261, 0, 136, 23));*/

       /* this._freeMovementButton = cc.MenuItemSprite.create(freeBtnNormal, freeBtnSelected, freeBtnDisabled,
            function () {
                selfPoint._emitter.setPositionType(cc.PARTICLE_TYPE_RELATIVE);
                selfPoint._relativeMovementButton.setVisible(true);
                selfPoint._freeMovementButton.setVisible(false);
                selfPoint._groupMovementButton.setVisible(false);
            });
        this._freeMovementButton.setPosition(10, 150);
        this._freeMovementButton.setAnchorPoint(cc.p(0, 0));

        this._relativeMovementButton = cc.MenuItemSprite.create(relativeBtnNormal, relativeBtnSelected, relativeBtnDisabled,
            function () {
                selfPoint._emitter.setPositionType(cc.PARTICLE_TYPE_GROUPED);
                selfPoint._relativeMovementButton.setVisible(false);
                selfPoint._freeMovementButton.setVisible(false);
                selfPoint._groupMovementButton.setVisible(true);
            });
        this._relativeMovementButton.setVisible(false);
        this._relativeMovementButton.setPosition(10, 150);
        this._relativeMovementButton.setAnchorPoint(cc.p(0, 0));

        this._groupMovementButton = cc.MenuItemSprite.create(groupBtnNormal, groupBtnSelected, groupBtnDisabled,
            function () {
                selfPoint._emitter.setPositionType(cc.PARTICLE_TYPE_FREE);
                selfPoint._relativeMovementButton.setVisible(false);
                selfPoint._freeMovementButton.setVisible(true);
                selfPoint._groupMovementButton.setVisible(false);
            });
        this._groupMovementButton.setVisible(false);
        this._groupMovementButton.setPosition(10, 150);
        this._groupMovementButton.setAnchorPoint(cc.p(0, 0));*/

       /* var spriteNormal = cc.Sprite.create(s_shapeModeMenuItem, cc.rect(0, 23 * 2, 115, 23));
        var spriteSelected = cc.Sprite.create(s_shapeModeMenuItem, cc.rect(0, 23, 115, 23));
        var spriteDisabled = cc.Sprite.create(s_shapeModeMenuItem, cc.rect(0, 0, 115, 23));*/

       /* this._shapeModeButton = cc.MenuItemSprite.create(spriteNormal, spriteSelected, spriteDisabled,
            function () {
                if(selfPoint._emitter.setDrawMode)
                    selfPoint._emitter.setDrawMode(cc.PARTICLE_TEXTURE_MODE);
                selfPoint._textureModeButton.setVisible(true);
                selfPoint._shapeModeButton.setVisible(false);
            });
        this._shapeModeButton.setPosition(10, 100);
        this._shapeModeButton.setAnchorPoint(cc.p(0, 0));
*/
        if( cc.config.platform != "browser" ) {
            // Shape type is not compatible with JSB
            this._shapeModeButton.setEnabled(false);
        }

        /*var spriteNormal_t = cc.Sprite.create(s_textureModeMenuItem, cc.rect(0, 23 * 2, 115, 23));
        var spriteSelected_t = cc.Sprite.create(s_textureModeMenuItem, cc.rect(0, 23, 115, 23));
        var spriteDisabled_t = cc.Sprite.create(s_textureModeMenuItem, cc.rect(0, 0, 115, 23));*/
/*
        this._textureModeButton = cc.MenuItemSprite.create(spriteNormal_t, spriteSelected_t, spriteDisabled_t,
            function () {
                if(selfPoint._emitter.setDrawMode)
                    selfPoint._emitter.setDrawMode(cc.PARTICLE_SHAPE_MODE);
                selfPoint._textureModeButton.setVisible(false);
                selfPoint._shapeModeButton.setVisible(true);
            });
        this._textureModeButton.setVisible(false);
        this._textureModeButton.setPosition(10, 100);
        this._textureModeButton.setAnchorPoint(cc.p(0, 0));
*/
       /* var menu = cc.Menu.create(item1, item2, item3, this._shapeModeButton, this._textureModeButton,
            this._freeMovementButton, this._relativeMovementButton, this._groupMovementButton);

        menu.setPosition(0,0);
        item1.setPosition(s.width / 2 - 100, 30);
        item2.setPosition(s.width / 2, 30);
        item3.setPosition(s.width / 2 + 100, 30);

        this.addChild(menu, 100);*/
        //TODO
        if(BENCHMARK_DEBUG){
        var labelAtlas = cc.LabelAtlas.create("0123456789", s_fpsImages, 16, 24, '.');
        this.addChild(labelAtlas, 100, TAG_LABEL_ATLAS);
        labelAtlas.setPosition(s.width - 66, 50);
        this.scheduleUpdate();
        }
        // moving background
      /*  this._background = cc.Sprite.create(s_back3);
        this.addChild(this._background, 5);
        this._background.setPosition(s.width / 2, s.height - 180);

        var move = cc.MoveBy.create(4, cc.p(300, 0));
        var move_back = move.reverse();

        var seq = cc.Sequence.create(move, move_back);
        this._background.runAction(cc.RepeatForever.create(seq));*/

       
    },

    onEnter:function () {
        this._super();

       /* var pLabel = this.getChildByTag(1000);
        pLabel.setString(this.title());*/
    },
    title:function () {
        return "No title";
    },

    subtitle:function(){
        return "(Tap the Screen)";
    },

    restartCallback:function (sender) {
        this._emitter.resetSystem();
    },
    nextCallback:function (sender) {
        var s = new ParticleTestScene();
        s.addChild(nextParticleAction());
        director.replaceScene(s);
    },
    backCallback:function (sender) {
        var s = new ParticleTestScene();
        s.addChild(backParticleAction());
        director.replaceScene(s);
    },
    toggleCallback:function (sender) {
        if (this._emitter.getPositionType() == cc.PARTICLE_TYPE_GROUPED)
            this._emitter.setPositionType(cc.PARTICLE_TYPE_FREE);
        else if (this._emitter.getPositionType() == cc.PARTICLE_TYPE_FREE)
            this._emitter.setPositionType(cc.PARTICLE_TYPE_RELATIVE);
        else if (this._emitter.getPositionType() == cc.PARTICLE_TYPE_RELATIVE)
            this._emitter.setPositionType(cc.PARTICLE_TYPE_GROUPED);
    },


    onTouchesBegan:function(touches, event){
        this._isPressed = true;
        this._moveToTouchPoint(touches);
    },

    onTouchesMoved: function(touches, event) {
        if(!this._isPressed)
            return;
        this._moveToTouchPoint(touches);
    },

    _moveToTouchPoint:function(touches){
        if( touches.length > 0 ) {
            var location = touches[0].getLocation();
            var pos = cc.p(0,0);
            if (this._background) {
                pos = this._background.convertToWorldSpace(cc.p(0,0));
            }
            this._emitter.setPosition(cc.pSub(location, pos));
        }
    },

    onTouchesEnded:function(touches, event){
       this._isPressed = false;
    },

    onMouseDragged : function( event ) {
        var location = event.getLocation();
        var pos = cc.p(0,0);
        if (this._background) {
            pos = this._background.convertToWorldSpace(cc.p(0,0));
        }
        this._emitter.setPosition(cc.pSub(location, pos));
        return true;
    },
    update:function (dt) {
        if (this._emitter) {
            var atlas = this.getChildByTag(TAG_LABEL_ATLAS);
            atlas.setString(this._emitter.getParticleCount().toFixed(0));
        }
    },
    setEmitterPosition:function () {
        var sourcePos = this._emitter.getSourcePosition();
        if( sourcePos.x === 0 && sourcePos.y === 0)
            this._emitter.setPosition(200,70);
    }
});




BenchmarkBurstPipeSystemQuad = cc.ParticleSystemQuad.extend({
  
    draw: function() {
        var VALID_DELTA_RATE = 0.3;
        var currentParticleCount = this.getParticleCount();
       // var particleCountGoal = cc.Director.getInstance().getRunningScene().getParticlesNum();
        var particleCountGoal = 120
        // TODO: fix it, if current count is always smaller than goal, e.g. low performance :(
        var valid = (Math.abs(particleCountGoal-currentParticleCount)/particleCountGoal) <= VALID_DELTA_RATE;
        if (valid) { // only call if particles are enough
                    
              
                benchmarkControllerInstance.startTestPass();
        }
        // call "ParticleSystemQuad.draw()
        for(var i=0;i<2;i++)
        this._super();
    
        if (valid) {
             
                benchmarkControllerInstance.stopTestPass();
            
        }
    }
});
BenchmarkBurstPipeSystemQuad.create = function (pListFile) {
    var ret = new BenchmarkBurstPipeSystemQuad();
    if (!pListFile || typeof(pListFile) === "number") {
        var ton = pListFile || 100;
        ret.setDrawMode(cc.PARTICLE_TEXTURE_MODE);
        ret.initWithTotalParticles(ton);
        return ret;
    }

    if (ret && ret.initWithFile(pListFile)) {
        return ret;
    }
    return null;
};

var DemoParticleFromFile = ParticleDemo.extend({
    _title:"",
    ctor:function(filename) {
        this._super();
        this._title = filename;
    },
    onEnter:function () {
        this._super();
        this.setColor(cc.c3b(0,0,0));
        this.removeChild(this._background, true);
        this._background = null;

        var filename = s_resprefix + "Particles/" + this._title + ".plist";
       // this._emitter = cc.ParticleSystem.create(filename);
        this._emitter = BenchmarkBurstPipeSystemQuad.create(filename);
        this.addChild(this._emitter, 10);

        /*if(this._title == "Flower"){
            if(this._emitter.setShapeType)
                this._emitter.setShapeType(cc.PARTICLE_STAR_SHAPE);
        }*///else if( this._title == "Upsidedown"){
         //   this._emitter.setDrawMode(cc.PARTICLE_TEXTURE_MODE);
        //}

        this.setEmitterPosition();
    },

    setEmitterPosition:function () {
        var sourcePos = this._emitter.getSourcePosition();
        if( sourcePos.x === 0 && sourcePos.y === 0)
            this._emitter.setPosition(director.getWinSize().width / 2, director.getWinSize().height / 2 - 50);
    },

    title:function () {
        return this._title;
    }
});
var BurstPipeTestBenchmarkScene = BenchmarkBaseTestScene.extend({
    runTest:function () {
      /*  sceneIdx = -1;
        MAX_LAYER = 33;*/ 

        director=cc.Director.getInstance();
        this.addChild(new DemoParticleFromFile("BurstPipe"));
        director.replaceScene(this);
    }
});
