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
        this.selectedColor = '#000000';
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
        },
        cut: function () {
            var data = this.copy();
            var selected = this.getSelected();
            for (var i = 0; i < selected.length; i++) {
                this.remove(selected[i]);
            }
            return data;
        },
        copy: function () {
            var data = this.getSelected().map(function (element) {
                return element.data;
            });
            return JSON.stringify(data);
        },
        paste: function (dataString) {
            if (dataString && typeof dataString === 'string') {
                var data = JSON.parse(dataString);
                for (var i = 0; i < data.length; i++) {
                    this.add(data[i]);
                }
            }
        },
        bringToFront: function () {
            var moveTo = this.elements.length - 1;
            for (var i = this.elements.length - 1; i >= 0; i--) {
                if (this.elements[i].selected) {
                    this.shiftElementIndex(i, moveTo);
                    moveTo--;
                }
            }
            this.elementsChanged.fire();
        },
        bringForward: function () {
            for (var i = this.elements.length - 2; i >= 0; i--) {
                if (this.elements[i].selected &&
                        !this.elements[i + 1].selected) {
                    this.shiftElementIndex(i, i + 1);
                }
            }
            this.elementsChanged.fire();
        },
        sendBackward: function () {
            for (var i = 1; i < this.elements.length; i++) {
                if (this.elements[i].selected &&
                        !this.elements[i - 1].selected) {
                    this.shiftElementIndex(i, i - 1);
                }
            }
            this.elementsChanged.fire();
        },
        sendToBack: function () {
            var moveTo = 0;
            for (var i = 0; i < this.elements.length; i++) {
                if (this.elements[i].selected) {
                    this.shiftElementIndex(i, moveTo);
                    moveTo++;
                }
            }
            this.elementsChanged.fire();
        },
        shiftElementIndex: function (from, to) {
            this.data.splice(to, 0, this.data.splice(from, 1)[0]);
            this.elements.splice(to, 0, this.elements.splice(from, 1)[0]);
        }
    };
    return Model;
})(annotatr, window.jQuery);
