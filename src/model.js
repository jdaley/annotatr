annotatr.Model = (function (annotatr, $) {
    'use strict';

    function createElement(data) {
        if (data.type === 'line') {
            return new annotatr.Line(data);
        } else {
            return new annotatr.Shape(data);
        }
    }

    function Model(data) {
        this.data = data || [];
        this.elements = [];
        this.elementsChanged = $.Callbacks();

        for (var i = 0; i < this.data.length; i++) {
            this.elements.push(createElement(this.data[i]));
        }
    }

    Model.prototype = {
        add: function (data) {
            var element = createElement(data);
            this.data.push(data);
            this.elements.push(element);
            this.elementsChanged.fire();
            return element;
        }
    };

    return Model;
})(annotatr, window.jQuery);
