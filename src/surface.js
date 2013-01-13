annotatr.Surface = (function (annotatr, $, Raphael) {
    'use strict';

    function Surface($container, model) {
        this.$container = $container;
        this.model = model;
        this.elementObjs = [];

        var self = this;
        var elementsChangedHandler = function () { self.update(); };

        this.model.elementsChanged.add(elementsChangedHandler);

        this.dispose = function () {
            self.model.elementsChanged.remove(elementsChangedHandler);
        };

        $container.css('position', 'relative');
        $container.css('overflow', 'hidden');
        $container.css('background-color', '#ffffff');

        this.update();
    }

    Surface.prototype = {
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
                        element, this.$container);

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
