annotatr.Clipboard = (function (annotatr, $) {
    'use strict';

    function Clipboard(model) {
        this.model = model;
        this.data = null;

        var self = this;

        $(document).on('keydown', function (e) {
            if (e.ctrlKey && !e.altKey) {
                if (e.keyCode === 88) { // X
                    self.cut();
                } else if (e.keyCode === 67) { // C
                    self.copy();
                } else if (e.keyCode === 86) { // V
                    self.paste();
                }
            }
        });
    }

    Clipboard.prototype = {
        cut: function () {
            this.data = this.model.cut();
        },
        copy: function () {
            this.data = this.model.copy();
        },
        paste: function () {
            this.model.paste(this.data);
        }
    };

    return Clipboard;
})(annotatr, window.jQuery);
