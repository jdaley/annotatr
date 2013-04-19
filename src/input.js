annotatr.Input = (function (annotatr, $) {
    'use strict';

    function MouseMoveOperation(selected, p) {
        this.selected = selected;
        this.originalPos = selected.getPosition();
        this.offset = annotatr.utils.subtract(p, this.originalPos);
    }

    MouseMoveOperation.prototype = {
        move: function (p) {
            this.selected.setPosition(annotatr.utils.subtract(p, this.offset));
        },
        up: function () { },
        cancel: function () {
            this.selected.setPosition(this.originalPos);
        }
    };

    function MouseResizeOperation(selected, index, p) {
        this.selected = selected;
        this.index = index;
        this.originalPoint = selected.getPoints()[index];
        this.offset = annotatr.utils.subtract(p, this.originalPoint);
    }

    MouseResizeOperation.prototype = {
        move: function (p, shiftKey) {
            var newPoint = annotatr.utils.subtract(p, this.offset);
            if (shiftKey)
            {
                if (this.selected.isLine) {
                    var otherHandle = this.index === 0 ? this.selected.getPoints()[1] : this.selected.getPoints()[0];
                    var xDiff = Math.abs(newPoint.x - otherHandle.x);
                    var yDiff = Math.abs(newPoint.y - otherHandle.y);
                    if (xDiff < yDiff / 2) {
                        newPoint.x = otherHandle.x;
                    } else if (yDiff < xDiff / 2) {
                        newPoint.y = otherHandle.y;
                    } else {
                        var length = Math.min(xDiff, yDiff);
                        newPoint.x = otherHandle.x + length * (newPoint.x > otherHandle.x ? 1 : -1);
                        newPoint.y = otherHandle.y + length * (newPoint.y > otherHandle.y ? 1 : -1);
                    }
                }
            }
            this.selected.setPoint(this.index, newPoint);
        },
        up: function () { },
        cancel: function () {
            this.selected.setPoint(this.index, this.originalPoint);
        }
    };

    function Input(model, surface) {
        this.model = model;
        this.surface = surface;

        var self = this;
        this.mouseDown = function (e) { Input.prototype.mouseDown.call(self, e); };
        this.mouseUp = function (e) { Input.prototype.mouseUp.call(self, e); };
        this.mouseMove = function (e) { Input.prototype.mouseMove.call(self, e); };
        this.dblClick = function (e) { Input.prototype.dblClick.call(self, e); };
        this.keyDown = function (e) { Input.prototype.keyDown.call(self, e); };
        
        surface.$container.on('mousedown', this.mouseDown);
        $('body').on('mouseup', this.mouseUp);
        $('body').on('mousemove', this.mouseMove);
        $(document).on('keydown', this.keyDown);
        surface.$container.on('dblclick', this.dblClick);
    }

    Input.prototype = {
        dispose: function () {
            this.surface.$container.off('mousedown', this.mouseDown);
            $('body').off('mouseup', this.mouseUp);
            $('body').off('mousemove', this.mouseMove);
            this.surface.$container.off('dblclick', this.dblClick);
        },
        mouseDown: function (e) {
            if (this.mouseOperation) {
                e.preventDefault();
                return;
            }
            var p = this.surface.fromPagePoint({ x: e.pageX, y: e.pageY });
            var hit = this.surface.getHit(p);
            if (this.model.editing) {
                if (this.model.editing === hit) {
                    return;
                } else {
                    this.model.stopEditing();
                }
            }
            e.preventDefault();
            if (this.model.mode) {
                var newShapeData;
                if (this.model.mode === 'line') {
                    newShapeData = {
                        type: 'line',
                        x1: p.x,
                        y1: p.y,
                        x2: p.x,
                        y2: p.y
                    };
                }
                else if (this.model.mode === 'arrow'){
                    newShapeData = {
                        type: 'line',
                        x1: p.x,
                        y1: p.y,
                        x2: p.x,
                        y2: p.y,
                        head: 'arrow'
                    };
                } else {
                    newShapeData = {
                        type: this.model.mode,
                        text: '',
                        x: p.x,
                        y: p.y,
                        width: 0,
                        height: 0
                    };
                }
                var newElement = this.model.add(newShapeData);
                this.model.mode = null;
                this.model.select(newElement);
                this.mouseOperation = new MouseResizeOperation(newElement, newElement.getPoints().length - 1, p);
            } else if (hit === null) {
                this.model.selectNone();
            } else if (hit === this.model.selected) {
                var hitPoint = hit.getHitPoint(p);
                if (hitPoint === null) {
                    this.mouseOperation = new MouseMoveOperation(hit, p);
                } else {
                    this.mouseOperation = new MouseResizeOperation(hit, hitPoint, p);
                }
            } else {
                this.model.select(hit);
                this.mouseOperation = new MouseMoveOperation(hit, p);
            }
        },
        mouseUp: function (e) {
            if (this.mouseOperation) {
                e.preventDefault();
                this.mouseOperation.up();
                this.mouseOperation = null;
            }
        },
        mouseMove: function (e) {
            if (this.mouseOperation) {
                e.preventDefault();
                var p = this.surface.fromPagePoint({ x: e.pageX, y: e.pageY });
                this.mouseOperation.move(p, e.shiftKey);
            }
        },
        dblClick: function (e) {
            e.preventDefault();
            var p = this.surface.fromPagePoint({ x: e.pageX, y: e.pageY });
            var hit = this.surface.getHit(p);
            if (hit !== null && hit.setEditing) {
                this.model.startEditing(hit);
            }
        },
        keyDown: function (e) {
            if (e.keyCode === 27) { // escape
                if (this.mouseOperation) {
                    e.preventDefault();
                    this.mouseOperation.cancel();
                    this.mouseOperation = null;
                }
            }
        }
    };

    return Input;
})(annotatr, window.jQuery);
