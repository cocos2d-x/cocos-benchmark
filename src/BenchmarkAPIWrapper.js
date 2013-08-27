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


