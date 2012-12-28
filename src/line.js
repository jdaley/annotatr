annotatr.shapes['line'] = (function (utils, $, Raphael) {
    'use strict';

    function Line($container, data) {
        this.$container = $container;
        this.data = data;

        this.$element = $('<div>');
        this.$element.css('position', 'absolute');
        $container.append(this.$element);

        this.paper = new Raphael(this.$element.get(0),
            Math.abs(this.data.x1 - this.data.x2),
            Math.abs(this.data.y1 - this.data.y2));

        this.line = this.paper.path(this.getSvgPath());

        this.draw();
    }

    Line.prototype = {
        getSvgPath: function () {
            var p1 = this.toCanvasCoord({ x: this.data.x1, y: this.data.y1 });
            var p2 = this.toCanvasCoord({ x: this.data.x2, y: this.data.y2 });

            return 'M' + p1.x + ',' + p1.y +
                'L' + p2.x + ',' + p2.y;
        },
        toCanvasCoord: function (p) {
            return {
                x: p.x - Math.min(this.data.x1, this.data.x2),
                y: p.y - Math.min(this.data.y1, this.data.y2)
            };
        },
        draw: function () {
            this.$element.css('left', Math.min(this.data.x1, this.data.x2) + 'px');
            this.$element.css('top', Math.min(this.data.y1, this.data.y2) + 'px');

            this.paper.setSize(
                Math.abs(this.data.x1 - this.data.x2),
                Math.abs(this.data.y1 - this.data.y2));

            this.line.attr('path', this.getSvgPath());

            if (this.selected) {
                this.line.attr('stroke', 'blue');
                this.line.attr('stroke-width', 3);
            } else {
                this.line.attr('stroke', '#000000');
                this.line.attr('stroke-width', 2);
            }
        },
        isHit: function (p) {
            var distance = utils.distanceToLine(p,
                { x: this.data.x1, y: this.data.y1 },
                { x: this.data.x2, y: this.data.y2 });
            return distance <= 5;
        },
        getHitPoint: function (p) {
            var points = this.getPoints();
            for (var i = 0; i < points.length; i++) {
                if (utils.distance(p, points[i]) <= 10) {
                    return i;
                }
            }
            return null;
        },
        getPos: function () {
            return {
                x: Math.min(this.data.x1, this.data.x2),
                y: Math.min(this.data.y1, this.data.y2)
            };
        },
        setPos: function (p) {
            var delta = this.toCanvasCoord(p);
            this.data.x1 += delta.x;
            this.data.y1 += delta.y;
            this.data.x2 += delta.x;
            this.data.y2 += delta.y;
            this.$element.css('left', Math.min(this.data.x1, this.data.x2) + 'px');
            this.$element.css('top', Math.min(this.data.y1, this.data.y2) + 'px');
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
            this.draw();
        },
        setSelected: function (selected) {
            this.selected = selected;
            this.draw();
        }
    };

    return Line;
}(annotatr.utils, window.jQuery, Raphael));
