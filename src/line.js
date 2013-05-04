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
        getWidth: function () {
            return Math.max(this.data.x1, this.data.x2)
                - Math.min(this.data.x1, this.data.x2);
        },
        getHeight: function () {
            return Math.max(this.data.y1, this.data.y2)
                - Math.min(this.data.y1, this.data.y2);
        },
        setStroke: function (stroke) {
            this.data.stroke = stroke;
            this.changed.fire(this);
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
        },
        fireChanged: function () {
            this.changed.fire(this);
        }
    };

    return Line;
}(annotatr, window.jQuery));

annotatr.shapes['line'] = (function (annotatr, $, Raphael) {
    'use strict';

    function getSvgPath(element) {
        if(element.data.head === 'arrow'){
            var arrowHeadLength = 10;
            var arrowHeadSteepness = 26;
        }
        else{
            var arrowHeadLength = 0;
            var arrowHeadSteepness = 1;
        }

        var y1 = element.data.y1;
        var y2 = element.data.y2;
        var x1 = element.data.x1;
        var x2 = element.data.x2;

        var lineAngle = Math.atan((y2 - y1)/(x2 - x1));
        var end1;
        var end2;
       
        end1 = lineAngle + arrowHeadSteepness * 3.1 / 180;
        end2 = lineAngle - arrowHeadSteepness * 3.1 / 180;

        if(x2 >= x1){
            var y3 = y2 - arrowHeadLength * Math.sin(end1);
            var x3 = x2 - arrowHeadLength * Math.cos(end1);
            var y4 = y2 - arrowHeadLength * Math.sin(end2);
            var x4 = x2 - arrowHeadLength * Math.cos(end2);
        }
        else{
            var y3 = y2 + arrowHeadLength * Math.sin(end1);
            var x3 = x2 + arrowHeadLength * Math.cos(end1);
            var y4 = y2 + arrowHeadLength * Math.sin(end2);
            var x4 = x2 + arrowHeadLength * Math.cos(end2);
        }
        return 'M' + x1 + ',' + y1 +
            'L' + x2 + ',' + y2 +
            'M' + (x3) + ',' + (y3) +
            'L' + x2 + ',' + y2 +
            'L' + (x4) + ',' + (y4);
}

    function draw(element, $container, paper) {
        var line = paper.path(getSvgPath(element));

        line.attr('stroke', element.data.stroke);
        line.attr('stroke-width', 2);

        var objs = {
            line: line
        };

        update(element, objs);

        return objs;
    }

    function update(element, objs) {
        objs.line.attr({stroke: element.data.stroke});
        objs.line.attr('path', getSvgPath(element));
    }

    function remove(objs) {
        objs.line.remove();
    }

    return {
        draw: draw,
        update: update,
        remove: remove
    };
}(annotatr, window.jQuery, Raphael));
