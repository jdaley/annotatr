annotatr.shapes['path'] = (function (annotatr, $, Raphael) {
    'use strict';

    function draw(element, $container, paper) {
        var rPath = paper.path('M0,0');
        rPath.attr('stroke', element.data.stroke);
        rPath.attr('stroke-width', 3);
        var objs = {
            path: rPath
        };

        update(element, objs);

        return objs;
    }

    function update(element, objs) {
        //Transform the path according to its initial x,y
        //Find the min and max xy
        var minX, maxX,minY,maxY;
        minX = maxX = element.data.path[0][0];
        minY = maxY = element.data.path[0][1];
        for(var i = 1; i < element.data.path.length; i++){
            minX = Math.min(minX, element.data.path[i][0]);
            minY = Math.min(minY, element.data.path[i][1]);
            maxX = Math.max(maxX, element.data.path[i][0]);
            maxY = Math.max(maxY, element.data.path[i][1]);
        }

        var scaleX, scaleY;
        scaleX = (element.data.width / (maxX - minX)) || 11;
        scaleY = (element.data.height / (maxY - minY)) || 13;

        var transformedScaledPath = [];
        for(i = 0; i < element.data.path.length; i++){
            transformedScaledPath.push([
                (element.data.path[i][0]-minX)*scaleX + element.data.x,
                (element.data.path[i][1]-minY)*scaleY + element.data.y
            ]);
        }
        objs.path.attr({path:'M' + transformedScaledPath.join(',L')});
        objs.path.attr({stroke: element.data.stroke});
    }

    function remove(objs) {
        objs.path.remove();
    }

    return {
        draw: draw,
        update: update,
        remove: remove
    };
}(annotatr, window.jQuery, Raphael));
