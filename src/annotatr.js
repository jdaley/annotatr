annotatr = (function ($) {
    'use strict';

    var annotatr = {};

    function MouseMoveOperation(instance, p) {
        this.instance = instance;
        this.originalPos = instance.selected.getPosition();
        this.offset = annotatr.utils.subtract(p, this.originalPos);
    }

    MouseMoveOperation.prototype = {
        move: function (p) {
            this.instance.selected.setPosition(annotatr.utils.subtract(p, this.offset));
        },
        up: function () { },
        cancel: function () {
            this.instance.selected.setPosition(this.originalPos);
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
        this.model = new annotatr.Model(options.data);
        this.surface = new annotatr.Surface($container, this.model, options.width, options.height);

        var self = this;

        if (options.$toolbar) {
            self.addToolbar(options.$toolbar);
        }

        $container.mousedown(function (e) {
            if (self.mouseOperation) {
                e.preventDefault();
                return;
            }
            var p = self.fromPagePoint({ x: e.pageX, y: e.pageY });
            var hit = self.getHit(p);
            if (self.editable) {
                if (self.editable === hit) {
                    return;
                } else {
                    self.editable.setEditing(false);
                    self.editable = null;
                }
            }
            e.preventDefault();
            if (self.mode) {
                var newShapeData;
                if (self.mode === 'line') {
                    newShapeData = {
                        type: 'line',
                        x1: p.x,
                        y1: p.y,
                        x2: p.x,
                        y2: p.y
                    };
                } else {
                    newShapeData = {
                        type: self.mode,
                        text: '',
                        x: p.x,
                        y: p.y,
                        width: 0,
                        height: 0
                    };
                }
                var newElement = self.model.add(newShapeData);
                self.mode = null;
                self.select(newElement);
                self.mouseOperation = new MouseResizeOperation(self, newElement.getPoints().length - 1, p);
            } else if (hit === null) {
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
        $('body').mouseup(function (e) {
            if (self.mouseOperation) {
                e.preventDefault();
                self.mouseOperation.up();
                self.mouseOperation = null;
            }
        });
        $('body').mousemove(function (e) {
            if (self.mouseOperation) {
                e.preventDefault();
                var p = self.fromPagePoint({ x: e.pageX, y: e.pageY });
                self.mouseOperation.move(p);
            }
        });
        $container.dblclick(function (e) {
            e.preventDefault();
            var p = self.fromPagePoint({ x: e.pageX, y: e.pageY });
            var hit = self.getHit(p);
            if (hit !== null && hit.setEditing) {
                self.editable = hit;
                hit.setEditing(true);
            }
        });
    }

    Annotatr.prototype = {
        fromPagePoint: function (pagePoint) {
            var offset = this.surface.$container.offset();
            return {
                x: pagePoint.x - offset.left,
                y: pagePoint.y - offset.top
            };
        },
        getHit: function (p) {
            for (var i = this.model.elements.length - 1; i >= 0; i--) {
                var element = this.model.elements[i];
                if (element.isHit(p)) {
                    return element;
                }
            }
            return null;
        },
        select: function (element) {
            if (element !== this.selected) {
                this.selectNone();
                this.selected = element;
                element.setSelected(true);
            }
        },
        selectNone: function () {
            if (this.selected) {
                this.selected.setSelected(false);
                this.selected = null;
            }
        },
        addToolbar: function ($toolbar) {
            var self = this;
            $('[data-annotatr]', $toolbar).each(function () {
                var $this = $(this);
                var mode = $this.attr('data-annotatr');
                $this.click(function () {
                    self.mode = mode;
                });
            });
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
