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
                        if (model.selected && model.selected[0].data.type !== 'line'){
                            var x = model.selected[0].data.x;
                            for( var i = 1; i < model.selected.length; i++){                                    
                                model.selected[i].data.x = x;
                            }

                            for (i = 0; i < surface.objs.length; i++){
                                var element = surface.objs[i].element;
                                if (element.selected) {
                                    element.data.x = x;
                                    element.fireChanged();
                                }
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
