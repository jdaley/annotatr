annotatr.shapes['line'] = (function (utils, $) {
    'use strict';

    function Line($container, data) {
        this.$container = $container;
        this.data = data;

        this.$element = $('<canvas>');
        this.$element.css('position', 'absolute');
        $container.append(this.$element);

        this.canvas = this.$element.get(0);
        this.context = this.canvas.getContext('2d');

        this.draw();
    }

    Line.prototype = {
        toCanvasCoord: function (p) {
            return {
                x: p.x - Math.min(this.data.x1, this.data.x2),
                y: p.y - Math.min(this.data.y1, this.data.y2)
            };
        },
        draw: function () {
            this.$element.css('left', Math.min(this.data.x1, this.data.x2) + 'px');
            this.$element.css('top', Math.min(this.data.y1, this.data.y2) + 'px');
            this.$element.attr('width', Math.abs(this.data.x1 - this.data.x2));
            this.$element.attr('height', Math.abs(this.data.y1 - this.data.y2));

            var p1 = this.toCanvasCoord({ x: this.data.x1, y: this.data.y1 });
            var p2 = this.toCanvasCoord({ x: this.data.x2, y: this.data.y2 });

            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.beginPath();
            this.context.moveTo(p1.x, p1.y);
            this.context.lineTo(p2.x, p2.y);
            if (this.selected) {
                this.context.strokeStyle = 'blue';
                this.context.lineWidth = 3;
            } else {
                this.context.strokeStyle = '#000000';
                this.context.lineWidth = 2;
            }
            this.context.stroke();
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
}(annotatr.utils, window.jQuery));
