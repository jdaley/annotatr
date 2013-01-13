annotatr.shapes['oval'] = (function (annotatr, $, Raphael) {
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

    function draw(element, $container, paper) {
        var canvasCenter = getCenter(element);

        var ellipse = paper.ellipse(
            canvasCenter.x, canvasCenter.y,
            getHorizontalRadius(element), getVerticalRadius(element));

        var objs = {
            ellipse: ellipse
        };

        update(element, objs);

        return objs;
    }

    function update(element, objs) {
        var canvasCenter = getCenter(element);

        objs.ellipse.attr('cx', canvasCenter.x);
        objs.ellipse.attr('cy', canvasCenter.y);
        objs.ellipse.attr('rx', getHorizontalRadius(element));
        objs.ellipse.attr('ry', getVerticalRadius(element));

        if (element.selected) {
            objs.ellipse.attr('stroke', 'blue');
            objs.ellipse.attr('stroke-width', 3);
        } else {
            objs.ellipse.attr('stroke', '#000000');
            objs.ellipse.attr('stroke-width', 2);
        }
    }

    return {
        draw: draw,
        update: update
    };
}(annotatr, window.jQuery, Raphael));
