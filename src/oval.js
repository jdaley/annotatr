annotatr.elementTypes['oval'] = (function (annotatr, $, Raphael) {
    'use strict';

    function getCenter(element) {
        return {
            x: element.data.x + element.data.width / 2.0,
            y: element.data.y + element.data.height / 2.0
        };
    }

    function getHorizontalRadius(element) {
        return element.data.width / 2.0;
    }

    function getVerticalRadius(element) {
        return element.data.height / 2.0;
    }

    function Oval(data, model) {
        annotatr.Element.call(this, data, model);
    }

    Oval.prototype = $.extend(new annotatr.Element(), {
        draw: function ($container, paper) {
            var canvasCenter = getCenter(this);

            var ellipse = paper.ellipse(
                canvasCenter.x, canvasCenter.y,
                getHorizontalRadius(this), getVerticalRadius(this));

            ellipse.attr('stroke', this.data.stroke);
            ellipse.attr('stroke-width', 2);

            var objs = {
                ellipse: ellipse
            };

            this.update(objs);

            return objs;
        },
        update: function (objs) {
            var canvasCenter = getCenter(this);

            objs.ellipse.attr('cx', canvasCenter.x);
            objs.ellipse.attr('cy', canvasCenter.y);
            objs.ellipse.attr('rx', getHorizontalRadius(this));
            objs.ellipse.attr('ry', getVerticalRadius(this));
            objs.ellipse.attr({stroke: this.data.stroke});
        },
        remove: function (objs) {
            objs.ellipse.remove();
        }
    });

    return Oval;
}(annotatr, window.jQuery, Raphael));
