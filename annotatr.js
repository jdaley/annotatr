(function ($) {
    'use strict';

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

    var Image = function ($container, data) {
        this.$container = $container;
        this.data = data;

        this.$element = $('<img>');
        this.$element.css('position', 'absolute');
        this.draw();
        this.$element.attr('src', data.src);
        $container.append(this.$element);
    };

    Image.prototype = {
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
                if (distance(p, points[i]) <= 10) {
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
            this.draw();
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
            var delta = subtract(p, this.getPoints()[i]);
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
                this.$element.css('border', 'none');
            }
        }
    };

    var Line = function ($container, data) {
        this.$container = $container;
        this.data = data;

        this.$element = $('<canvas>');
        this.$element.css('position', 'absolute');
        $container.append(this.$element);

        this.canvas = this.$element.get(0);
        this.context = this.canvas.getContext('2d');

        this.draw();
    };

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
            var distance = distanceToLine(p,
                { x: this.data.x1, y: this.data.y1 },
                { x: this.data.x2, y: this.data.y2 });
            return distance <= 5;
        },
        getHitPoint: function (p) {
            var points = this.getPoints();
            for (var i = 0; i < points.length; i++) {
                if (distance(p, points[i]) <= 10) {
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

    var Text = function ($container, data) {
        this.$container = $container;
        this.data = data;

        this.$element = $('<div>');
        this.$element.css('position', 'absolute');
        this.draw();
        this.$element.text(data.text);
        this.$container.append(this.$element);
    };

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
                if (distance(p, points[i]) <= 10) {
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
            var delta = subtract(p, this.getPoints()[i]);
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
                this.$element.css('border', 'none');
            }
        }
    };

    var MouseMoveOperation = function (annotatr, p) {
        this.annotatr = annotatr;
        this.originalPos = annotatr.selected.getPos();
        this.offset = subtract(p, this.originalPos);
    };

    MouseMoveOperation.prototype = {
        move: function (p) {
            this.annotatr.selected.setPos(subtract(p, this.offset));
        },
        up: function () { },
        cancel: function () {
            this.annotatr.selected.setPos(this.originalPos);
        }
    };

    var MouseResizeOperation = function (annotatr, index, p) {
        this.annotatr = annotatr;
        this.index = index;
        this.originalPoint = annotatr.selected.getPoints()[index];
        this.offset = subtract(p, this.originalPoint);
    };

    MouseResizeOperation.prototype = {
        move: function (p) {
            this.annotatr.selected.setPoint(this.index, subtract(p, this.offset));
        },
        up: function () { },
        cancel: function () {
            this.annotatr.selected.setPoint(this.index, this.originalPoint);
        }
    };

    var Annotatr = function ($container, options) {
        var self = this;

        self.$container = $container;
        self.data = options.data;

        $container.css('position', 'relative');
        $container.css('background-color', '#ffffff');

        self.draw();

        $container.mousedown(function (e) {
            e.preventDefault();
            if (self.mouseOperation) {
                return;
            }
            var p = self.fromPagePoint({ x: e.pageX, y: e.pageY });
            var hit = self.getHit(p);
            if (hit === null) {
                self.selectNone();
            } else if (hit === self.selected) {
                var hitPoint = hit.getHitPoint(p);
                if (hitPoint === null) {
                    self.mouseOperation = new MouseMoveOperation(self, p);
                } else {
                    self.mouseOperation = new MouseResizeOperation(self, hitPoint, p);
                }
            } else {
                self.select(hit);
                self.mouseOperation = new MouseMoveOperation(self, p);
            }
        });
        $container.mouseup(function (e) {
            e.preventDefault();
            if (self.mouseOperation) {
                self.mouseOperation.up();
                self.mouseOperation = null;
            }
        });
        $container.mousemove(function (e) {
            e.preventDefault();
            if (self.mouseOperation) {
                var p = self.fromPagePoint({ x: e.pageX, y: e.pageY });
                self.mouseOperation.move(p);
            }
        });
    };

    Annotatr.prototype = {
        fromPagePoint: function (pagePoint) {
            var offset = this.$container.offset();
            return {
                x: pagePoint.x - offset.left,
                y: pagePoint.y - offset.top
            };
        },
        getHit: function (p) {
            for (var i = this.shapes.length - 1; i >= 0; i--) {
                var shape = this.shapes[i];
                if (shape.isHit(p)) {
                    return shape;
                }
            }
            return null;
        },
        draw: function () {
            this.$container.empty();
            this.shapes = [];

            for (var i = 0; i < this.data.length; i++) {
                var item = this.data[i];

                if (item.type === 'image') {
                    this.shapes.push(new Image(this.$container, item));
                } else if (item.type === 'line') {
                    this.shapes.push(new Line(this.$container, item));
                } else if (item.type === 'text') {
                    this.shapes.push(new Text(this.$container, item));
                }
            }
        },
        select: function (shape) {
            if (shape !== this.selected) {
                this.selectNone();
                this.selected = shape;
                shape.setSelected(true);
            }
        },
        selectNone: function () {
            if (this.selected) {
                this.selected.setSelected(false);
                this.selected = null;
            }
        }
    };

    $.fn.annotatr = function (options) {
        return this.each(function () {
            var $this = $(this);
            $this.data('annotatr', new Annotatr($this, options));
        });
    };
}(window.jQuery));
