/****************************************************************************
 Copyright (c) 2013-2014 Intel Corporation.
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