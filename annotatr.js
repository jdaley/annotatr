(function ($) {
    'use strict';

    var Annotatr = function ($element, options) {
        this.$element = $element;
        this.data = options.data;

        this.$element.css('position', 'relative');
        this.$element.css('background-color', '#ffffff');

        this.draw();
    };

    Annotatr.prototype = {
        draw: function () {
            this.$element.empty();

            for (var i = 0; i < this.data.length; i++) {
                var item = this.data[i];

                if (item.type === 'image') {
                    this.$element.append('<img src="' + item.src + '" style="position: absolute">');
                } else if (item.type === 'line') {
                    var $canvas = $('<canvas>');
                    $canvas.css('position', 'absolute');
                    $canvas.css('left', item.x1 + 'px');
                    $canvas.css('top', item.y1 + 'px');
                    $canvas.css('width', (item.x2 - item.x1) + 'px');
                    $canvas.css('height', (item.y2 - item.y1) + 'px');
                    this.$element.append($canvas);

                    var context = $canvas.get(0).getContext('2d');
                    context.fillStyle = '#000000';
                    context.beginPath();
                    context.moveTo(0, 0);
                    context.lineTo(item.x2 - item.x1, item.y2 - item.y1);
                    context.lineWidth = 2;
                    context.stroke();
                } else if (item.type === 'text') {
                    var $div = $('<div>');
                    $div.css('position', 'absolute');
                    $div.css('left', item.x + 'px');
                    $div.css('top', item.y + 'px');
                    $div.css('width', item.width + 'px');
                    $div.css('height', item.height + 'px');
                    $div.text(item.text);
                    this.$element.append($div);
                }
            }
        }
    };

    $.fn.annotatr = function (options) {
        return this.each(function () {
            var $this = $(this);
            $this.data('annotatr', new Annotatr($this, options));
        });
    };
}(window.jQuery));
