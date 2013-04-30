annotatr.elementTypes['text'] = (function (annotatr, $, Raphael) {
    'use strict';

    function Text(data, model) {
        annotatr.Element.call(this, data, model);
    }

    Text.prototype = $.extend(new annotatr.Element(), {
        draw: function ($container) {
            var $element = $('<div>');
            $element.css('position', 'absolute');
            $element.css('overflow', 'hidden');
            $element.css('background-color', '#ffffff');
            $element.css('border', 'solid 1px');
            $element.css('border-color', this.data.stroke);
            $element.text(this.data.text);
            $container.append($element);

            var objs = {
                $element: $element,
                editing: false
            };

            this.update(objs);

            return objs;
        },
        update: function (objs) {
            objs.$element.css('left', this.data.x + 'px');
            objs.$element.css('top', this.data.y + 'px');
            objs.$element.css('width', this.data.width + 'px');
            objs.$element.css('height', this.data.height + 'px');
            objs.$element.css('border-color', this.data.stroke);
            if (this.editing && !objs.editing) {
                objs.$element.attr('contentEditable', 'true');
                objs.$element.focus();
                objs.editing = true;
            } else {
                objs.$element.attr('contentEditable', 'false');
                objs.$element.blur();
                objs.editing = false;
            }
        },
        remove: function (objs) {
            objs.$element.remove();
        }
    });

    return Text;
}(annotatr, window.jQuery, Raphael));
