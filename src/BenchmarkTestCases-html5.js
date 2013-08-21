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
                referenceFPS: 5.78
            },
            {
                name: 'DrawPoly',
                referenceFPS: 11.03
            },
            {
                name: 'DrawSegment',
                referenceFPS: 11.40
            }
        ]
    },
    {
        category: 'Particle',
        defaultDuration: 5000,
        tests: [
            {
                name: 'Size8',
                referenceFPS: 34.15
            },
            {
                name: 'BurstPipe',
                referenceFPS: 19.68
            },
            {
                name: 'Comet',
                referenceFPS: 11.19
            }
        ]
    },
    {
        category: 'Sprite',
        defaultDuration: 3000,
        tests: [
            {
                name: 'Position',
                referenceFPS: 3.75
            },
            {
                name: 'Actions',
                referenceFPS: 2.39
            }
        ]
    },
    {
        category: 'TileMap',
        defaultDuration: 3000,
        tests: [
            {
                name: 'Isometric',
                referenceFPS: 3.94
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

