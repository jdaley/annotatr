annotatr.elementTypes['path'] = (function (annotatr, $, Raphael) {
    'use strict';

    function Path(data, model) {
        annotatr.Element.call(this, data, model);
    }

    Path.prototype = $.extend(new annotatr.Element(), {
        draw: function ($container, paper) {
            var rPath = paper.path('M0,0');
            rPath.attr('stroke', this.data.stroke);
            rPath.attr('stroke-width', 3);
            var objs = {
                path: rPath
            };

            this.update(objs);

            return objs;
        },
        update: function (objs) {
            //Transform the path according to its initial x,y
            //Find the min and max xy
            var minX, maxX,minY,maxY;
            minX = maxX = this.data.path[0][0];
            minY = maxY = this.data.path[0][1];
            for(var i = 1; i < this.data.path.length; i++){
                minX = Math.min(minX, this.data.path[i][0]);
                minY = Math.min(minY, this.data.path[i][1]);
                maxX = Math.max(maxX, this.data.path[i][0]);
                maxY = Math.max(maxY, this.data.path[i][1]);
            }

            var scaleX, scaleY;
            scaleX = (this.data.width / (maxX - minX)) || 11;
            scaleY = (this.data.height / (maxY - minY)) || 13;

            var transformedScaledPath = [];
            for(i = 0; i < this.data.path.length; i++){
                transformedScaledPath.push([
                    (this.data.path[i][0]-minX)*scaleX + this.data.x,
                    (this.data.path[i][1]-minY)*scaleY + this.data.y
                ]);
            }
            objs.path.attr({path:'M' + transformedScaledPath.join(',L')});
            objs.path.attr({stroke: this.data.stroke});
        },
        remove: function (objs) {
            objs.path.remove();
        }
    });

    return Path;
}(annotatr, window.jQuery, Raphael));
