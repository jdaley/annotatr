annotatr.Element = (function (annotatr, $) {
    'use strict';

    function Element(data, model) {
        this.data = data;
        this.model = model;
        this.selected = false;
        this.editing = false;
        this.changed = $.Callbacks();
    }

    Element.prototype = {
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
        },
        drawSelect: function (paper, hideBorder) {
            var objs = {};

            if (!hideBorder) {
                objs.border = paper.rect(
                    this.data.x, this.data.y,
                    this.data.width, this.data.height);
            }

            var points = this.getPoints();
            objs.points = [];

            for (var i = 0; i < points.length; i++) {
                var rect = paper.rect(
                    points[i].x - 3, points[i].y - 3, 6, 6, 1);
                objs.points.push(rect);
            }
            // Draw the toolbar for the selected shape
            var rect = paper.rect(
                points[0].x + 2, points[0].y - 13, 10, 10, 1);
            this.formatBar = rect;
            
            // Set up the "isHit()" code for the toolbar
            var self = this;
            this.formatBar.isHit = function (p) {
                var formatBarRec = self.formatBar[0]; //Rect
                return p.x >= formatBarRec.x.baseVal.value &&
                    p.x <= formatBarRec.x.baseVal.value + formatBarRec.width.baseVal.value &&
                    p.y >= formatBarRec.y.baseVal.value &&
                    p.y <= formatBarRec.y.baseVal.value + formatBarRec.height.baseVal.value;
            };

            this.updateSelect(objs);

            return objs;
        },
        updateSelect: function (objs) {
            var i;
            if (this.selected) {
                if (objs.border) {
                    objs.border.show();
                    objs.border.attr('x', this.data.x);
                    objs.border.attr('y', this.data.y);
                    objs.border.attr('width', this.data.width);
                    objs.border.attr('height', this.data.height);
                }
                
                // Draw the handles on the selected shape
                var points = this.getPoints();
                for (i = 0; i < objs.points.length; i++) {
                    var rect = objs.points[i];
                    rect.show();
                    rect.attr('x', points[i].x - 3);
                    rect.attr('y', points[i].y - 3);
                }

                this.formatBar.show();
                this.formatBar.attr('x', points[0].x + 2);
                this.formatBar.attr('y', points[0].y - 13);

            } else {
                if (objs.border) {
                    objs.border.hide();
                }
                for (i = 0; i < objs.points.length; i++) {
                    objs.points[i].hide();
                }
                if (this.formatBar) {
                    this.formatBar.hide();
                }
            }
        },
        removeSelect: function (objs) {
            if (objs.border) {
                objs.border.remove();
            }

            for (var i = 0; i < objs.points.length; i++) {
                objs.points[i].remove();
            }
        }
    };

    return Element;
})(annotatr, window.jQuery);
