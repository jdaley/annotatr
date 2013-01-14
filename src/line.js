annotatr.Line = (function (annotatr, $) {
    'use strict';

    function Line(data) {
        this.data = data;
        this.selected = false;
        this.changed = $.Callbacks();
    }

    Line.prototype = {
        isLine: true,
        getPosition: function () {
            return {
                x: Math.min(this.data.x1, this.data.x2),
                y: Math.min(this.data.y1, this.data.y2)
            };
        },
        setPosition: function (p) {
            var delta = annotatr.utils.subtract(p, this.getPosition());
            this.data.x1 += delta.x;
            this.data.y1 += delta.y;
            this.data.x2 += delta.x;
            this.data.y2 += delta.y;
            this.changed.fire(this);
        },
        isHit: function (p) {
            var distance = annotatr.utils.distanceToLine(p,
                { x: this.data.x1, y: this.data.y1 },
                { x: this.data.x2, y: this.data.y2 });
            return distance <= 5;
        },
        getHitPoint: function (p) {
            var points = this.getPoints();
            for (var i = 0; i < points.length; i++) {
                if (annotatr.utils.distance(p, points[i]) <= 10) {
                    return i;
                }
            }
            return null;
        },
        getPoints: function () {
            return [
                { x: this.data.x1, y: this.data.y1 },
                { x: this.data.x2, y: this.data.y2 }
            ];
        },
        setPoint: function (i, p) {
            if (i === 0) {
                this.data.x1 = p.x;
                this.data.y1 = p.y;
            } else if (i === 1) {
                this.data.x2 = p.x;
                this.data.y2 = p.y;
            }
            this.changed.fire(this);
        },
        setSelected: function (selected) {
            this.selected = selected;
            this.changed.fire(this);
        }
    };

    return Line;
}(annotatr, window.jQuery));

annotatr.shapes['line'] = (function (annotatr, $, Raphael) {
    'use strict';

    function getSvgPath(element) {
        return 'M' + element.data.x1 + ',' + element.data.y1 +
            'L' + element.data.x2 + ',' + element.data.y2;
    }

    function draw(element, $container, paper) {
        var line = paper.path(getSvgPath(element));

        line.attr('stroke', '#000000');
        line.attr('stroke-width', 2);

        var objs = {
            line: line
        };

        update(element, objs);

        return objs;
    }

    function update(element, objs) {
        objs.line.attr('path', getSvgPath(element));
    }

    return {
        draw: draw,
        update: update
    };
}(annotatr, window.jQuery, Raphael));
