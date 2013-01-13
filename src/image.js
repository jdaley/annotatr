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

        if (element.selected) {
            objs.border.attr('stroke', 'blue');
            objs.border.attr('stroke-width', 3);
        } else {
            objs.border.attr('stroke', '#000000');
            objs.border.attr('stroke-width', 2);
        }
    }
    
    return {
        draw: draw,
        update: update
    };
}(annotatr.utils, window.jQuery));
