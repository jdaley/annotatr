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
                        model.repeatMode = false;
                    } else {
                        model.mode = mode;
                    }
                }),
                $this.dblclick(function () {
                    model.mode = mode;
                    model.repeatMode = true;
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
                        if (model.selected.length){
                            var p = {};
                            p.x = model.selected[0].getPosition().x;
                            for( var i = 1; i < model.selected.length; i++) {
                                p.y = model.selected[i].getPosition().y;
                                model.selected[i].setPosition(p);
                            }
                        }
                    } else if (mode == 'rightAlign') {
                        if (model.selected.length) {
                            var p = {};
                            var rightEdge = model.selected[0].getWidth() + model.selected[0].getPosition().x;
                            for( var i = 1; i < model.selected.length; i++){
                                p.x = rightEdge - model.selected[i].getWidth();
                                p.y = model.selected[i].getPosition().y;
                                model.selected[i].setPosition(p);
                            }
                        }
                    } else if (mode == 'topAlign') {
                        if (model.selected.length) {
                            var p = {};
                            p.y = model.selected[0].getPosition().y;
                            for( var i = 1; i < model.selected.length; i++) {
                                p.x = model.selected[i].getPosition().x;
                                model.selected[i].setPosition(p);
                            }
                        }
                    } else if (mode == 'bottomAlign') {
                        if (model.selected.length) {
                            var p = {};
                            var bottomEdge = model.selected[0].getHeight() + model.selected[0].getPosition().y;
                            for( var i = 1; i < model.selected.length; i++) {
                                p.y = bottomEdge - model.selected[i].getHeight();
                                p.x = model.selected[i].getPosition().x;
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
