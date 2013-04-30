annotatr.elementTypes['image'] = (function (utils, $) {
    'use strict';

    function Image(data, model) {
        annotatr.Element.call(this, data, model);
    }

    Image.prototype = $.extend(new annotatr.Element(), {
        draw: function ($container, paper) {
            var image = paper.image(this.data.src,
                this.data.x, this.data.y,
                this.data.width, this.data.height);

            var border = paper.rect(
                this.data.x, this.data.y,
                this.data.width, this.data.height);

            var objs = {
                image: image,
                border: border
            };

            this.update(objs);

            return objs;
        },
        update: function (objs) {
            objs.image.attr('x', this.data.x);
            objs.image.attr('y', this.data.y);
            objs.image.attr('width', this.data.width);
            objs.image.attr('height', this.data.height);

            objs.border.attr('x', this.data.x);
            objs.border.attr('y', this.data.y);
            objs.border.attr('width', this.data.width);
            objs.border.attr('height', this.data.height);
        },
        remove: function (objs) {
            objs.image.remove();
            objs.border.remove();

        }
    });

    return Image;
}(annotatr.utils, window.jQuery));
