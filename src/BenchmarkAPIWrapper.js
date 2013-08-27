/**
 * Created with JetBrains PhpStorm.
 * APIWrapper is used to supply universal engine API for benchmark, even if API change when engine upgrades
 * User: sunzhuoshi
 * Date: 7/18/13
 * Time: 10:25 AM
 */
var BenchmarkAPIWrapper = {};

BenchmarkAPIWrapper.ParticleSystem = null;

// particle system API name changed after cocos2d-x version xxx
if (typeof cc.ParticleSystemQuad === 'function') {
    BenchmarkAPIWrapper.ParticleSystem = cc.ParticleSystemQuad;
}
else if (typeof cc.ParticleSystem === 'function') {
    BenchmarkAPIWrapper.ParticleSystem = cc.ParticleSystem;
}

BenchmarkAPIWrapper.Scheduler = function() {
    var useTimeout = false;
    if (typeof setTimeout === 'function') {
        useTimeout = true;
        this._timerIDs = [];
    }
    // delay: seconds
    this.schedule = function(target, selector, delay) {
        var me = this;
        if (useTimeout) {
            var timerID = setTimeout(
                function() {
                    selector.call(target);
                    var index = me._timerIDs.indexOf(timerID);
                    if (0 <= index) {
                        me._timerIDs.splice(index, 1);
                    }
                },
                delay * 1000
            );
            this._timerIDs.push(timerID);
        }
        else {
            cc.Director.getInstance().getScheduler().scheduleCallbackForTarget(
                target,
                selector,
                0,
                false,
                delay
            );
        }
    };
    this.unscheduleAll = function() {
        var i;
        for (i=0; i<this._timerIDs.length; ++i) {
            clearTimeout(this._timerIDs[i]);
        }
        this._timerIDs = [];
    }
};

BenchmarkAPIWrapper.Scheduler.getInstance = function() {
    if (!this._instance) {
        BenchmarkAPIWrapper.Scheduler._instance = new BenchmarkAPIWrapper.Scheduler();
    }
    return this._instance;
};
