/**
 * Created with JetBrains PhpStorm.
 * User: sunzhuoshi
 * Date: 8/9/13
 * Time: 11:45 AM
 */
var BenchmarkHtml5TestCases = [
    {
        category: 'DrawPrimitives',
        defaultDuration: 2000,
        tests: [
            {
                name: 'DrawDot',
                referenceFPS: 52.54
            },
            {
                name: 'DrawPoly',
                referenceFPS: 52.54
            },
            {
                name: 'DrawSegment',
                referenceFPS: 52.54
            }
        ]
    },
    {
        category: 'Particle',
        defaultDuration: 5000,
        tests: [
            {
                name: 'Size8',
                referenceFPS: 16.79
            },
            {
                name: 'BurstPipe',
                referenceFPS: 18.85
            },
            {
                name: 'Comet',
                referenceFPS: 10.63
            }
        ]
    },
    {
        category: 'Sprite',
        defaultDuration: 3000,
        tests: [
            {
                name: 'Position',
                referenceFPS: 3.47
            },
            {
                name: 'Actions',
                referenceFPS: 2.42
            }
        ]
    },
    {
        category: 'TileMap',
        defaultDuration: 3000,
        tests: [
            {
                name: 'Isometric',
                referenceFPS: 3.73
            }
        ]
    }
];

(function() {
    var i;
    for (i=0; i<BenchmarkHtml5TestCases.length; ++i) {
        BenchmarkTestCases.push(BenchmarkHtml5TestCases[i]);
    }
})();

