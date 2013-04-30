annotatr.Model = (function (annotatr, $) {
    'use strict';

    function createElement(data) {
        return new annotatr.elementTypes[data.type](data);
    }

    function Model(data) {
        this.data = data || [];
        this.elements = [];
        this.elementsChanged = $.Callbacks();
        this.selected = null;
        this.editing = null;

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
        },
        remove: function (element) {
            if (this.selected === element) {
                this.selectNone();
            }
            for (var i = 0; i < this.elements.length; i++) {
                if (this.elements[i] === element) {
                    this.data.splice(i, 1);
                    this.elements.splice(i, 1);
                    this.elementsChanged.fire();
                    return;
                }
            }
        },
        select: function (element) {
            if (element !== this.selected) {
                this.selectNone();
                this.selected = element;
                element.setSelected(true);
            }
        },
        selectNone: function () {
            if (this.selected) {
                this.selected.setSelected(false);
                this.selected = null;
            }
        },
        startEditing: function (element) {
            if (element !== this.editing) {
                this.stopEditing();
                this.editing = element;
                element.setEditing(true);
            }
        },
        stopEditing: function () {
            if (this.editing) {
                this.editing.setEditing(false);
                this.editing = null;
            }
        }
    };

    return Model;
})(annotatr, window.jQuery);
