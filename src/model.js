annotatr.Model = (function (annotatr, $) {
    'use strict';

    function createElement(data) {
        if (data.type === 'line') {
            return new annotatr.Line(data);
        } else {
            return new annotatr.Shape(data);
        }
    }

    function Model(data, undo) {
        this.data = data || [];
        this.undo = undo;
        this.elements = [];
        this.elementsChanged = $.Callbacks();
        this.selected = [];
        this.editing = [];

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
            var found = false;
            // If the element is in the selected array, remove it.
            for (var i = 0; i < this.selected.length; i++){
                if (element === this.selected[i]){
                    found = true;
                    // Remove the element, and set its selected = false
                    this.selected.splice(i,1)[0].setSelected(false);
                }
            }

            if (!found)
            {
                this.selected.push(element);
                element.setSelected(true);
            }
        },
        selectNone: function () {
            while (this.selected && this.selected.length > 0){
                this.selected[this.selected.length - 1].setSelected(false);
                this.selected.splice(this.selected.length - 1,1);
            }
        },
        getSelected: function () {
            return this.selected.slice(0); // return a copy of the array
        },
        startEditing: function (element) {
            var found = false;
            // If the element is in the editing array, remove it.
            for (var i = 0; i < this.editing.length; i++){
                if (element === this.editing[i]){
                    found = true;
                    // Remove the element, and set its editing = false
                    element.setEditing(false);
                    this.editing.splice(i,1);
                }
            }

            if (!found)
            {
                this.editing.push(element);
                element.setEditing(true);
            }
        },
        stopEditing: function () {
            while (this.editing && this.editing.length > 0){
                var elements = this.editing.splice(this.editing.length - 1,1);
                elements[0].setEditing(false)
            }       
        }
    };
    return Model;
})(annotatr, window.jQuery);
