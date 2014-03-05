cocos-benchmark
===============
Cocos-benchmark is a benchmark for cocos2d, which is designed to compare different engine versions of the same platform, different platforms to each other(Inspired by [SunSpider][7]).

The first version is for [Cocos2d-html5][1], and it will support Hybrid and native in the future.

It currently supports canvas and will support WebGL and OpenGL ES 2.0 in the future.

Platforms
-------------
   * Browsers: Chrome 14+, Safari 5.0+, IE9+, Firefox 3.5+.
   * Mobile Browsers: Mobile Safari 3.0+, Android Browser 3.0+, MiuiBrowser 1.0
   * Mobile Devices: iPhone 4(s), iPhone 5, iPod 4, MI 2S, K800, K900

Pre-Requirements
-------------
   * mysql 5.5 or above
   * php 5.2 or above

Run locally
------------------

1. Clone the code
2. Update submodule `lib/cocos2d-html5`
2. Create database with `sql/cocos_benchmark.sql`
3. Edit database config
4. Config web server access, make sure dir `lib/phpbrowscap` is writable
5. Open your browser, input the url

Example:

    $ git clone https://github.com/cocos2d-x/cocos-benchmark.git
    $ cd cocos-benchmark
    $ git submodule update --init lib/cocos2d-html5
    $ mysql -uroot -hlocalhost
    mysql> source ./sql/cocos_benchmark.sql
    mysql> exit
    $ vi config.php
    <?php>
    define('DATABASE_HOST', '127.0.0.1');
    define('DATABASE_USER', 'root');
    define('DATABASE_PASSWORD, '');
    defone('DATABASE_NAME', 'cocos_benchmark');
    

Build and deploy to remote
--------------------------
1. Create database as the local one
2. Edit `config.sh` with remote server info
3. Run `build_and_deploy.sh` script
4. Create `config.php` with remote values on the remote server
5. Config web server access, make sure dir `lib/phpbrowscap` is writable

Examples:

    $ vi config.sh
    #!/bin/sh
    # leave it blank for default target
    compile_target=
    upload_server=REMOTE_HOST
    upload_user=REMOTE_SSH_USER
    upload_dir=REMOTE_FULL_PATH
    $ ./build_and_deploy.sh
    
Add support for new platforms (EXPERIMENTAL)
-----------------------------
1. Edit `lib/phpbrowscap/browscap.ini` to add new platforms
2. Remove `lib/phpbrowscap/cache.php` if any
3. Open `update.php` page in your browser to re-parse existing data

`browscap.ini` sample fragment for K900:

    [Mozilla/5.0 (Linux*Android 4.2*Lenovo_K900*)*AppleWebKit/*(*KHTML, like Gecko*)*Version/4.2*Safari/*]
    Parent="Android Browser 4.2"
    Platform_Version=4.2
    Device_Name="K900"
    Device_Maker="Lenovo"

Documentation
------------------
   * Website: [www.cocos2d-x.org][2]
   * API: [API References][3]

Contact us
------------------
   * Forum: [http://forum.cocos2d-x.org][4]
   * Twitter: [http://www.twitter.com/cocos2dhtml5][5]
   * Sina macro-blog: [http://t.sina.com.cn/cocos2dhtml5][6]

[1]: http://www.cocos2d-html5.org "Cocos2d-html5"
[2]: http://www.cocos2d-x.org "www.cocos2d-x.org"
[3]: http://www.cocos2d-x.org/reference/html5-js/index.html "API References"
[4]: http://forum.cocos2d-x.org "http://forum.cocos2d-x.org"
[5]: http://www.twitter.com/cocos2dhtml5 "http://www.twitter.com/cocos2dhtml5"
[6]: http://t.sina.com.cn/cocos2dhtml5 "http://t.sina.com.cn/cocos2dhtml5"
[7]: http://www.webkit.org/perf/sunspider/sunspider.html "SunSpider"
