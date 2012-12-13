annotatr = (function ($) {
    'use strict';

    var annotatr = {};

    function MouseMoveOperation(instance, p) {
        this.instance = instance;
        this.originalPos = instance.selected.getPos();
        this.offset = annotatr.utils.subtract(p, this.originalPos);
    }

    MouseMoveOperation.prototype = {
        move: function (p) {
            this.instance.selected.setPos(annotatr.utils.subtract(p, this.offset));
        },
        up: function () { },
        cancel: function () {
            this.instance.selected.setPos(this.originalPos);
        }
    };

    function MouseResizeOperation(instance, index, p) {
        this.instance = instance;
        this.index = index;
        this.originalPoint = instance.selected.getPoints()[index];
        this.offset = annotatr.utils.subtract(p, this.originalPoint);
    }

    MouseResizeOperation.prototype = {
        move: function (p) {
            this.instance.selected.setPoint(this.index, annotatr.utils.subtract(p, this.offset));
        },
        up: function () { },
        cancel: function () {
            this.instance.selected.setPoint(this.index, this.originalPoint);
        }
    };

    function Annotatr($container, options) {
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
    }

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
                this.shapes.push(new annotatr.shapes[item.type](this.$container, item));
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

    annotatr.Annotatr = Annotatr;
    annotatr.shapes = {};
    return annotatr;
}(window.jQuery));
