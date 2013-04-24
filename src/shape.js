annotatr.Shape = (function (annotatr, $) {
    'use strict';

    function Shape(data) {
        this.data = data;
        this.selected = false;
        this.editing = false;
        this.changed = $.Callbacks();
    }

    Shape.prototype = {
        isLine: false,
        getPosition: function () {
            return { x: this.data.x, y: this.data.y };
        },
        setPosition: function (p) {
            this.data.x = p.x;
            this.data.y = p.y;
            this.changed.fire(this);
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
                if (annotatr.utils.distance(p, points[i]) <= 10) {
                    return i;
                }
            }
            return null;
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
            var delta = annotatr.utils.subtract(p, this.getPoints()[i]);
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
            this.changed.fire(this);
        },
        setSelected: function (selected) {
            this.selected = selected;
            this.changed.fire(this);
        },
        setEditing: function (editing) {
            this.editing = editing;
            this.changed.fire(this);
        },
        fireChanged: function () {
            this.changed.fire(this);
        }
    };

    return Shape;
}(annotatr, window.jQuery));