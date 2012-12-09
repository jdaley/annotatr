(function ($) {
    'use strict';

    var Annotatr = function ($element, options) {
        var self = this;

        this.$element = $element;
        this.data = options.data;

        $element.css('position', 'relative');
        $element.css('background-color', '#ffffff');

        $element.mousedown(function (e) {
            var parentOffset = $(this).offset();
            var relX = e.pageX - parentOffset.left;
            var relY = e.pageY - parentOffset.top;
            self.selected = self.getHit(relX, relY);
            self.offsetX = relX - self.selected.x;
            self.offsetY = relY - self.selected.y;
        });
        $element.mouseup(function () {
            self.selected = null;
        });
        $element.mousemove(function (e) {
            if (self.selected) {
                var parentOffset = $(this).offset();
                var relX = e.pageX - parentOffset.left;
                var relY = e.pageY - parentOffset.top;
                self.selected.x = relX - self.offsetX;
                self.selected.y = relY - self.offsetY;
                self.draw();
            }
        });

        this.draw();
    };

    Annotatr.prototype = {
        getHit: function (x, y) {
            for (var i = this.data.length - 1; i >= 0; i--) {
                var item = this.data[i];

                if (x >= item.x &&
                    x <= item.x + item.width &&
                    y >= item.y &&
                    y <= item.y + item.height) {
                    return item;
                }
            }
            return null;
        },

        draw: function () {
            this.$element.empty();

            for (var i = 0; i < this.data.length; i++) {
                var item = this.data[i];

                if (item.type === 'image') {
                    var $img = $('<img>');
                    $img.css('position', 'absolute');
                    $img.css('left', item.x + 'px');
                    $img.css('top', item.y + 'px');
                    $img.css('width', item.width + 'px');
                    $img.css('height', item.height + 'px');
                    $img.attr('src', item.src);
                    this.$element.append($img);
                } else if (item.type === 'line') {
                    var $canvas = $('<canvas>');
                    $canvas.css('position', 'absolute');
                    $canvas.css('left', item.x + 'px');
                    $canvas.css('top', item.y + 'px');
                    $canvas.css('width', item.width + 'px');
                    $canvas.css('height', item.height + 'px');
                    this.$element.append($canvas);

                    var context = $canvas.get(0).getContext('2d');
                    context.fillStyle = '#000000';
                    context.beginPath();
                    context.moveTo(0, 0);
                    context.lineTo(item.width, item.height);
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
