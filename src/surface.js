annotatr.Surface = (function (annotatr, $, Raphael) {
    'use strict';

    function Surface($container, model, width, height) {
        this.$container = $container;
        this.model = model;
        this.elementObjs = [];

        $container.css('position', 'relative');
        $container.css('overflow', 'hidden');
        $container.css('background-color', '#ffffff');

        this.$paperContainer = $('<div>');
        this.$paperContainer.css('position', 'absolute');
        this.$paperContainer.css('width', width);
        this.$paperContainer.css('height', height);
        this.$paperContainer.css('margin', '0');
        this.$paperContainer.css('padding', '0');
        $container.append(this.$paperContainer);

        this.paper = new Raphael(this.$paperContainer.get(0), width, height);

        var self = this;
        var elementsChangedHandler = function () { self.update(); };

        this.model.elementsChanged.add(elementsChangedHandler);

        this.dispose = function () {
            self.model.elementsChanged.remove(elementsChangedHandler);
        };

        this.update();
    }

    Surface.prototype = {
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
        getObjs: function (element) {
            for (var i = 0; i < this.elementObjs.length; i++) {
                if (this.elementObjs[i].element === element) {
                    return this.elementObjs[i].objs;
                }
            }
            return null;
        },
        update: function () {
            for (var i = 0; i < this.model.elements.length; i++) {
                var element = this.model.elements[i];

                if (!this.getObjs(element)) {
                    var objs = annotatr.shapes[element.data.type].draw(
                        element, this.$container, this.paper);

                    this.elementObjs.push({
                        element: element,
                        objs: objs
                    });

                    var self = this;
                    element.changed.add(function (element) {
                        var renderer = annotatr.shapes[element.data.type];
                        renderer.update(element, self.getObjs(element));
                    });
                }
            }
        }
    };

    return Surface;
})(annotatr, window.jQuery, Raphael);
