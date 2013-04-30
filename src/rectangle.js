annotatr.elementTypes['rectangle'] = (function (annotatr, $, Raphael) {
    'use strict';

    function Rectangle(data, model) {
        annotatr.Element.call(this, data, model);
    }

    Rectangle.prototype = $.extend(new annotatr.Element(), {
        draw: function ($container, paper) {
            var rectangle = paper.rect(
                this.data.x, this.data.y,
                this.data.width, this.data.height);

            rectangle.attr('stroke-width', 2);
            rectangle.attr('stroke', '#000000');

            var objs = {
                rectangle: rectangle
            };

            this.update(objs);

            return objs;
        },
        update: function (objs) {
            objs.rectangle.attr('x', this.data.x);
            objs.rectangle.attr('y', this.data.y);
            objs.rectangle.attr('width', this.data.width);
            objs.rectangle.attr('height', this.data.height);
            objs.rectangle.attr({stroke: this.data.stroke});
        },
        remove: function (objs) {
            objs.rectangle.remove();
        }
    });

    return Rectangle;
}(annotatr, window.jQuery, Raphael));
