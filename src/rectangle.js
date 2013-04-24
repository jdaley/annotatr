annotatr.shapes['rectangle'] = (function (annotatr, $, Raphael) {
    'use strict';

    function draw(element, $container, paper) {
        var rectangle = paper.rect(
            element.data.x, element.data.y,
            element.data.width, element.data.height);

        rectangle.attr('stroke', '#000000');
        rectangle.attr('stroke-width', 2);

        var objs = {
            rectangle: rectangle
        };

        update(element, objs);

        return objs;
    }

    function update(element, objs) {
        objs.rectangle.attr('x', element.data.x);
        objs.rectangle.attr('y', element.data.y);
        objs.rectangle.attr('width', element.data.width);
        objs.rectangle.attr('height', element.data.height);
    }

    function remove(objs) {
        objs.rectangle.remove();
    }

    return {
        draw: draw,
        update: update,
        remove: remove
    };
}(annotatr, window.jQuery, Raphael));
