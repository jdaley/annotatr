annotatr.shapes['text'] = (function (annotatr, $, Raphael) {
    'use strict';

    function draw(element, $container) {
        var $element = $('<div>');
        $element.css('position', 'absolute');
        $element.css('overflow', 'hidden');
        $element.css('background-color', '#ffffff');
        $element.css('border', 'solid 1px');
        $element.css('border-color', element.data.stroke);
        $element.text(element.data.text);
        $container.append($element);

        var objs = {
            $element: $element,
            editing: false
        };

        update(element, objs);

        return objs;
    }

    function update(element, objs) {
        objs.$element.css('left', element.data.x + 'px');
        objs.$element.css('top', element.data.y + 'px');
        objs.$element.css('width', element.data.width + 'px');
        objs.$element.css('height', element.data.height + 'px');
        objs.$element.css('border-color', element.data.stroke);
        if (element.editing && !objs.editing) {
            objs.$element.attr('contentEditable', 'true');
            objs.$element.focus();
            objs.editing = true;
        } else {
            objs.$element.attr('contentEditable', 'false');
            objs.$element.blur();
            objs.editing = false;
        }
    }

    function remove(objs) {
        objs.$element.remove();
    }

    return {
        draw: draw,
        update: update,
        remove: remove
    };
}(annotatr, window.jQuery, Raphael));
