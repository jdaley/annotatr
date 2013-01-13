annotatr.Surface = (function (annotatr, $, Raphael) {
    'use strict';

    function createPaper($container, width, height) {
        var $paperContainer = $('<div>');
        $paperContainer.css('position', 'absolute');
        $paperContainer.css('margin', '0');
        $paperContainer.css('padding', '0');
        $container.append($paperContainer);

        var paper = new Raphael($paperContainer.get(0), width, height);
        return paper;
    }

    function drawSelect(element, paper) {
        var objs = {};

        if (element.data.type !== 'line') {
            objs.border = paper.rect(
                element.data.x, element.data.y,
                element.data.width, element.data.height);
        }

        var points = element.getPoints();
        objs.points = [];

        for (var i = 0; i < points.length; i++) {
            var rect = paper.rect(
                points[i].x - 3, points[i].y - 3, 6, 6, 1);
            objs.points.push(rect);
        }

        updateSelect(element, objs);

        return objs;
    }

    function updateSelect(element, objs) {
        var i;
        if (element.selected) {
            if (objs.border) {
                objs.border.show();
                objs.border.attr('x', element.data.x);
                objs.border.attr('y', element.data.y);
                objs.border.attr('width', element.data.width);
                objs.border.attr('height', element.data.height);
            }
            var points = element.getPoints();
            for (i = 0; i < objs.points.length; i++) {
                var rect = objs.points[i];
                rect.show();
                rect.attr('x', points[i].x - 3);
                rect.attr('y', points[i].y - 3);
            }
        } else {
            if (objs.border) {
                objs.border.hide();
            }
            for (i = 0; i < objs.points.length; i++) {
                objs.points[i].hide();
            }
        }
    }

    function Surface($container, model, width, height) {
        this.$container = $container;
        this.model = model;
        this.objs = [];

        $container.css('position', 'relative');
        $container.css('overflow', 'hidden');
        $container.css('background-color', '#ffffff');

        this.renderPaper = createPaper($container, width, height);
        this.selectPaper = createPaper($container, width, height);

        var self = this;
        this.update = function () { Surface.prototype.update.call(self); };

        this.model.elementsChanged.add(this.update);

        this.update();
    }

    Surface.prototype = {
        dispose: function () {
            this.model.elementsChanged.remove(this.update);
        },
        fromPagePoint: function (pagePoint) {
            var offset = this.$container.offset();
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
        getRenderObjs: function (element) {
            for (var i = 0; i < this.objs.length; i++) {
                if (this.objs[i].element === element) {
                    return this.objs[i].renderObjs;
                }
            }
            return null;
        },
        getSelectObjs: function (element) {
            for (var i = 0; i < this.objs.length; i++) {
                if (this.objs[i].element === element) {
                    return this.objs[i].selectObjs;
                }
            }
            return null;
        },
        update: function () {
            for (var i = 0; i < this.model.elements.length; i++) {
                var element = this.model.elements[i];

                if (!this.getRenderObjs(element)) {
                    var renderObjs = annotatr.shapes[element.data.type].draw(
                        element, this.$container, this.renderPaper);

                    var selectObjs = drawSelect(element, this.selectPaper);

                    this.objs.push({
                        element: element,
                        renderObjs: renderObjs,
                        selectObjs: selectObjs
                    });

                    var self = this;
                    element.changed.add(function (element) {
                        var renderer = annotatr.shapes[element.data.type];
                        renderer.update(element, self.getRenderObjs(element));
                        updateSelect(element, self.getSelectObjs(element));
                    });
                }
            }
        }
    };

    return Surface;
})(annotatr, window.jQuery, Raphael);
