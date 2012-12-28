annotatr.shapes['oval'] = (function (utils, $, Raphael) {
    'use strict';

    function Oval($container, data) {
        this.$container = $container;
        this.data = data;

        this.$element = $('<div>');
        this.$element.css('position', 'absolute');
        $container.append(this.$element);

        this.paper = new Raphael(this.$element.get(0), this.data.width, this.data.height);

        var canvasCenter = this.toCanvasCoord(this.getCenter());

        this.ellipse = this.paper.ellipse(
            canvasCenter.x, canvasCenter.y,
            this.getHorizontalRadius(), this.getVerticalRadius());

        this.draw();
    }

    Oval.prototype = {
        getCenter: function () {
            return {
                x: this.data.x + this.data.width / 2.0,
                y: this.data.y + this.data.height / 2.0
            };
        },
        getHorizontalRadius: function () {
            return this.data.width / 2.0;
        },
        getVerticalRadius: function () {
            return this.data.height / 2.0;
        },
        toCanvasCoord: function (p) {
            return {
                x: p.x - this.data.x,
                y: p.y - this.data.y
            };
        },
        draw: function () {
            this.$element.css('left', this.data.x + 'px');
            this.$element.css('top', this.data.y + 'px');

            this.paper.setSize(this.data.width, this.data.height);

            var canvasCenter = this.toCanvasCoord(this.getCenter());

            this.ellipse.attr('cx', canvasCenter.x);
            this.ellipse.attr('cy', canvasCenter.y);
            this.ellipse.attr('rx', this.getHorizontalRadius());
            this.ellipse.attr('ry', this.getVerticalRadius());

            if (this.selected) {
                this.ellipse.attr('stroke', 'blue');
                this.ellipse.attr('stroke-width', 3);
            } else {
                this.ellipse.attr('stroke', '#000000');
                this.ellipse.attr('stroke-width', 2);
            }
        },
        isHit: function (p) {
            return p.x >= this.data.x &&
                p.x <= this.data.x + this.data.width &&
                p.y >= this.data.y &&
                p.y <= this.data.y + this.data.height;
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
                x: this.data.x,
                y: this.data.y
            };
        },
        setPos: function (p) {
            var delta = this.toCanvasCoord(p);
            this.data.x += delta.x;
            this.data.y += delta.y;
            this.$element.css('left', this.data.x + 'px');
            this.$element.css('top', this.data.y + 'px');
        },
        getPoints: function () {
            return [
                { x: this.data.x, y: this.data.y },
                { x: this.data.x + this.data.width, y: this.data.y },
                { x: this.data.x, y: this.data.y + this.data.height },
                { x: this.data.x + this.data.width, y: this.data.y + this.data.height }
            ];
        },
        setPoint: function (i, p) {
            var delta = utils.subtract(p, this.getPoints()[i]);
            if (i === 0) { // top-left
                this.data.x += delta.x;
                this.data.y += delta.y;
                this.data.width -= delta.x;
                this.data.height -= delta.y;
            } else if (i === 1) { // top-right
                this.data.y += delta.y;
                this.data.width += delta.x;
                this.data.height -= delta.y;
            } else if (i === 2) { // bottom-left
                this.data.x += delta.x;
                this.data.width -= delta.x;
                this.data.height += delta.y;
            } else if (i === 3) { // bottom-right
                this.data.width += delta.x;
                this.data.height += delta.y;
            }
            this.draw();
        },
        setSelected: function (selected) {
            this.selected = selected;
            this.draw();
        }
    };

    return Oval;
}(annotatr.utils, window.jQuery, Raphael));
