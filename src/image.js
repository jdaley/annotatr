annotatr.shapes['image'] = (function (utils, $) {
    'use strict';

    function draw(element, $container, paper) {
        var image = paper.image(element.data.src,
            element.data.x, element.data.y,
            element.data.width, element.data.height);

        var border = paper.rect(
            element.data.x, element.data.y,
            element.data.width, element.data.height);

        var objs = {
            image: image,
            border: border
        };

        update(element, objs);

        return objs;
    }

    function update(element, objs) {
        objs.image.attr('x', element.data.x);
        objs.image.attr('y', element.data.y);
        objs.image.attr('width', element.data.width);
        objs.image.attr('height', element.data.height);

        objs.border.attr('x', element.data.x);
        objs.border.attr('y', element.data.y);
        objs.border.attr('width', element.data.width);
        objs.border.attr('height', element.data.height);
        objs.border.attr('stroke', element.data.stroke);
    }

    function remove(objs) {
        objs.image.remove();
        objs.border.remove();
    }

    return {
        draw: draw,
        update: update,
        remove: remove
    };
}(annotatr.utils, window.jQuery));
