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

            // Cycle through the elements to see if any have been hit
            for (var i = this.model.elements.length - 1; i >= 0; i--) {
                var element = this.model.elements[i];
                if (element.selected && element.formatBar.isHit(p)){
                    element.data.stroke = '#FF00FF';
                    return element;
                }
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
            var i = 0;

            while (i < this.objs.length) {
                var toDelete = true;
                var obj = this.objs[i];
                for (var j = 0; j < this.model.elements.length; j++) {
                    if (obj.element === this.model.elements[j]) {
                        toDelete = false;
                    }
                }

                if (toDelete) {
                    obj.element.remove(obj.renderObjs);
                    obj.element.removeSelect(obj.selectObjs);
                    this.objs.splice(i, 1);
                } else {
                    i++;
                }
            }

            for (i = 0; i < this.model.elements.length; i++) {
                var element = this.model.elements[i];

                if (!this.getRenderObjs(element)) {
                    var renderObjs = element.draw(
                        this.$container, this.renderPaper);

                    var selectObjs = element.drawSelect(this.selectPaper);

                    this.objs.push({
                        element: element,
                        renderObjs: renderObjs,
                        selectObjs: selectObjs
                    });

                    var self = this;
                    element.changed.add(function (element) {
                        element.update(self.getRenderObjs(element));
                        element.updateSelect(self.getSelectObjs(element));
                    });
                }
            }
        }
    };

    return Surface;
})(annotatr, window.jQuery, Raphael);
