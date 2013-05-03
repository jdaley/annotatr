annotatr.Input = (function (annotatr, $) {
    'use strict';

    function MouseMoveOperation(model, selected, p) {
        this.model = model;
        this.selected = selected;
        this.originalPos = [];
        this.offset = [];
        for (var i = 0; i < this.selected.length; i++){
            this.originalPos.push(this.selected[i].getPosition());   
            this.offset[i] = annotatr.utils.subtract(p, this.originalPos[i]);
        }
    }

    MouseMoveOperation.prototype = {
        move: function (p) {
            for (var i = 0; i < this.selected.length; i++){
                this.selected[i].setPosition(annotatr.utils.subtract(p, this.offset[i]));
            }
        },
        up: function () { },
        cancel: function () {
            this.selected.setPosition(this.originalPos);
        }
    };

    function MouseDrawOperation(model, path) {
        this.model = model;
        this.path = path;
        this.maxX = path.data.x;
        this.maxY = path.data.y;
    }

    // Draw a path
    MouseDrawOperation.prototype = {
        move: function (p) {
            this.path.data.path.push([p.x,p.y]);
            this.path.data.x = Math.min(this.path.data.x, p.x);
            this.path.data.y = Math.min(this.path.data.y, p.y);
            this.maxX = Math.max(this.maxX, p.x);
            this.maxY = Math.max(this.maxY, p.y);
            this.path.data.width = this.maxX - this.path.data.x;
            this.path.data.height = this.maxY - this.path.data.y;
            this.path.fireChanged();
        },
        up: function () {
            this.model.mode = 'path';
        },
        cancel: function () {
            this.model.remove(this.path);
        }
    };

    function MouseResizeOperation(model, selected, index, p, isNew) {
        this.model = model;
        this.selected = selected;
        this.index = index;
        this.originalPoint = selected.getPoints()[index];
        this.offset = annotatr.utils.subtract(p, this.originalPoint);
        this.isNew = isNew;
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
            if (this.isNew) {
                this.model.remove(this.selected);
            } else {
                this.selected.setPoint(this.index, this.originalPoint);
            }
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

        // Add event listeners to browser
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
            if (this.model.editing.length > 0) {
                for (var i = 0; i < this.model.editing; i++){
                    if (this.model.editing[i] === hit) {
                        return;
                    }    
                }

                this.model.stopEditing();
            }
            e.preventDefault();
            if (this.model.mode === 'path'){
                newShapeData = {
                    type: 'path',
                    x: p.x,
                    y: p.y,
                    width: 0,
                    height: 0,
                    stroke: '#000000',
                    path: [[p.x,p.y]]
                };
                var newPath = this.model.add(newShapeData);
                this.model.mode = null;
                this.model.selectNone();
                this.mouseOperation = new MouseDrawOperation(this.model, newPath);
            } else if (this.model.mode) {
                var newShapeData;
                if (this.model.mode === 'line') {
                    newShapeData = {
                        type: 'line',
                        x1: p.x,
                        y1: p.y,
                        x2: p.x,
                        y2: p.y,
                        stroke: '#000000' 
                    };
                } else if (this.model.mode === 'arrow'){
                    newShapeData = {
                        type: 'line',
                        x1: p.x,
                        y1: p.y,
                        x2: p.x,
                        y2: p.y,
                        head: 'arrow',
                        stroke: '#000000'
                    };
                } else{
                    newShapeData = {
                        type: this.model.mode,
                        text: '',
                        x: p.x,
                        y: p.y,
                        width: 0,
                        height: 0,
                        stroke: '#000000'
                    };
                }
                var newElement = this.model.add(newShapeData);
                this.model.mode = null;
                this.model.select(newElement);
                this.mouseOperation = new MouseResizeOperation(this.model, newElement, newElement.getPoints().length - 1, p, true);
            } else if (hit === null) {
                this.model.selectNone();
            } else if (this.model.selected.indexOf(hit) >= 0) {
                var hitPoint = hit.getHitPoint(p);
                if (hitPoint === null) {
                    this.mouseOperation = new MouseMoveOperation(this.model, this.model.selected, p);
                } else {
                    this.mouseOperation = new MouseResizeOperation(this.model, hit, hitPoint, p, false);
                }
            } else {
                this.model.select(hit);
                this.mouseOperation = new MouseMoveOperation(this.model, this.model.selected, p);
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
            if (e.keyCode === 46) { // delete
                var selected = this.model.selected;
                if (selected) {
                    for (var i = 0; i < selected.length; i++){
                            this.model.remove(selected[i]);
                        }
                }
            }
        }
    };

    return Input;
})(annotatr, window.jQuery);
