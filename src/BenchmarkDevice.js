/**
 * Created with JetBrains PhpStorm.
 * User: sunzhuoshi
 * Date: 9/16/13
 * Time: 11:49 AM
 */
var BenchmarkDevice = {};

BenchmarkDevice.iPhone4x = 'iPhone4(s)';
BenchmarkDevice.iPhone5 = 'iPhone5';
BenchmarkDevice.iPod4   = 'iPod4';
BenchmarkDevice.iPod5   = 'iPod5';
BenchmarkDevice.Unknown = 'unknown';
BenchmarkDevice.Apple   = 'Apple';

BenchmarkDevice.currentDeviceInfo = function() {
    var deviceInfo = {
        name: this.Unknown,
        maker: this.Unknown
    };
    var pixelRatio = window.devicePixelRatio || 1;
    cc.log(navigator.platform);
    cc.log(pixelRatio);
    cc.log(screen.availHeight);
    switch (navigator.platform) {
        case 'iPhone':
            deviceInfo.maker = this.Apple;
            if (screen.availWidth === 320 &&
                screen.availHeight === 548 &&
                pixelRatio === 2) {
                deviceInfo.name = this.iPhone5;
            }
            else if (screen.availWidth == 320 &&
                screen.availHeight === 460 &&
                pixelRatio === 2) {
                deviceInfo.name = this.iPhone4x;
            }
            break;
        case 'iPod':
            deviceInfo.maker = this.Apple;
            if (screen.availWidth === 320 &&
                screen.availHeight === 548 &&
                pixelRatio === 2) {
                deviceInfo.name = this.iPod5;
            }
            else if (screen.availWidth == 320 &&
                screen.availHeight === 460 &&
                pixelRatio === 2) {
                deviceInfo.name = this.iPod4;
            }
            break;
        default:
            break;
    }
    return deviceInfo;
};