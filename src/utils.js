annotatr.utils = (function () {
    'use strict';

    function equal(v, w) {
        return v.x === w.x && v.y === w.y;
    }

    function subtract(v, w) {
        return {
            x: v.x - w.x,
            y: v.y - w.y
        };
    }

    function sqr(x) { return x * x; }

    function distanceSqr(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y); }
    
    function distance(v, w) { return Math.sqrt(distanceSqr(v, w)); }

    function distanceToLine(p, v, w) {
        /* See http://stackoverflow.com/questions/849211 */
        var l2 = distanceSqr(v, w);
        if (l2 === 0) {
            return distance(p, v);
        }
        var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
        if (t < 0) {
            return distance(p, v);
        } else if (t > 1) {
            return distance(p, w);
        } else {
            return distance(p, {
                x: v.x + t * (w.x - v.x),
                y: v.y + t * (w.y - v.y)
            });
        }
    }

    return {
        equal: equal,
        subtract: subtract,
        distance: distance,
        distanceToLine: distanceToLine
    };
})();
