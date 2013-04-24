annotatr = (function ($) {
    'use strict';

    var annotatr = {};

    function Annotatr($container, options) {
        this.model = new annotatr.Model(options.data);
        this.surface = new annotatr.Surface($container, this.model, options.width, options.height);
        this.input = new annotatr.Input(this.model, this.surface);

        if (options.$toolbar) {
            this.addToolbar(options.$toolbar);
        }
    }

    Annotatr.prototype = {
        dispose: function () {
            this.input.dispose();
            this.surface.dispose();
        },
        addToolbar: function ($toolbar) {
            var model = this.model;
            $('[data-annotatr]', $toolbar).each(function () {
                var $this = $(this);
                var mode = $this.attr('data-annotatr');
                $this.click(function () {
                    if (model.mode === mode) {
                        model.mode = null;
                    } else {
                        model.mode = mode;
                    }
                });
            });
        }
    };

    $.fn.annotatr = function (options) {
        return this.each(function () {
            var $this = $(this);
            $this.data('annotatr', new Annotatr($this, options));
        });
    };

    annotatr.Annotatr = Annotatr;
    annotatr.shapes = {};
    return annotatr;
}(window.jQuery));
