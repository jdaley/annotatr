annotatr.shapes['text'] = (function (utils, $) {
    'use strict';

    function Text($container, data) {
        this.$container = $container;
        this.data = data;

        this.$element = $('<div>');
        this.$element.css('position', 'absolute');
        this.$element.css('overflow', 'hidden');
        this.$element.css('background-color', '#ffffff');
        this.draw();
        this.setSelected(false);
        this.$element.text(data.text);
        this.$container.append(this.$element);
    }

    Text.prototype = {
        draw: function () {
            this.$element.css('left', this.data.x + 'px');
            this.$element.css('top', this.data.y + 'px');
            this.$element.css('width', this.data.width + 'px');
            this.$element.css('height', this.data.height + 'px');
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
            return { x: this.data.x, y: this.data.y };
        },
        setPos: function (p) {
            this.data.x = p.x;
            this.data.y = p.y;
            this.$element.css('left', p.x + 'px');
            this.$element.css('top', p.y + 'px');
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
            if (selected) {
                this.$element.css('border', 'solid 1px blue');
            } else {
                this.$element.css('border', 'solid 1px black');
            }
        },
        startEditing: function () {
            this.$element.attr('contentEditable', 'true');
            this.$element.focus();
        },
        stopEditing: function () {
            this.$element.attr('contentEditable', 'false');
            this.$element.blur();
        }
    };

    return Text;
}(annotatr.utils, window.jQuery));
