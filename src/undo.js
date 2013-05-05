annotatr.Undo = (function (annotatr, $) {
    'use strict';

    function Undo() {
        this.undoOps = [];
        this.redoOps = [];
        this.maximumOps = 30;

        var self = this;

        $(document).on('keydown', function (e) {
            if (e.ctrlKey && !e.altKey) {
                if (e.keyCode === 90) { // Z
                    self.undo();
                } else if (e.keyCode === 89) { // Y
                    self.redo();
                }
            }
        });
    }

    Undo.prototype = {
        push: function (op) {
            // Clear redoOps
            if (this.redoOps.length > 0) {
                this.redoOps.splice(0, this.redoOps.length);
            }

            // Don't go over the maximum number of undo ops
            if (this.undoOps.length >= this.maximumOps) {
                this.undoOps.shift();
            }

            this.undoOps.push(op);
        },
        undo: function () {
            if (this.undoOps.length === 0) {
                return false;
            }

            var op = this.undoOps.pop();
            this.redoOps.push(op);

            op.undo();

            return true;
        },
        redo: function () {
            if (this.redoOps.length === 0) {
                return false;
            }

            var op = this.redoOps.pop();
            this.undoOps.push(op);

            op.redo();

            return true;
        }
    };

    return Undo;
})(annotatr, window.jQuery);
