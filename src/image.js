annotatr.shapes['image'] = (function (utils, $) {
    'use strict';

    function draw(element, $container) {
        var $element = $('<img>');
        $element.css('position', 'absolute');
        $element.attr('src', element.data.src);
        $container.append($element);

        var objs = {
            $element: $element
        };

        update(element, objs);

        return objs;
    }

    function update(element, objs) {
        objs.$element.css('left', element.data.x + 'px');
        objs.$element.css('top', element.data.y + 'px');
        objs.$element.css('width', element.data.width + 'px');
        objs.$element.css('height', element.data.height + 'px');

        if (element.selected) {
            objs.$element.css('border', 'solid 1px blue');
        } else {
            objs.$element.css('border', 'none');
        }
    }
    
    return {
        draw: draw,
        update: update
    };
}(annotatr.utils, window.jQuery));
