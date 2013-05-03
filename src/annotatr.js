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

        if (options.$formatbar) {
            this.addFormatbar(options.$formatbar, this.surface);
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
        },
        addFormatbar: function ($formatbar, surface) {
            var model = this.model;
            $('[data-annotatr]', $formatbar).each(function () {
                var $this = $(this);
                var mode = $this.attr('data-annotatr');
                $this.click(function () {
                    if (mode == 'leftAlign'){
                        if (model.selected.length/* && model.selected[0].data.type !== 'line'*/){
                            var p = {};
                            p.x = model.selected[0].getPosition().x;
                            for( var i = 1; i < model.selected.length; i++){                                    
                                p.y = model.selected[i].getPosition().y;
                                model.selected[i].setPosition(p);
                            }
                        }
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
