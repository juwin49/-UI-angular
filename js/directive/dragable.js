'use strict';
directive.directive('draggable', ['$document', function ($document) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            var startX = 0, startY = 0, x = 0, y = 0, sTop = 0, sLeft = 0, top = 0, left = 0, mLeft, mTop, width, height, box = element.parent();

            function init() {
                var padding = Math.abs(box.css('paddingLeft').replace('px', ''));
                mTop = Math.abs(box.css('marginTop').replace('px', ''));
                mLeft = Math.abs(box.css('marginLeft').replace('px', ''));
                width = box.width() + padding * 2;
                height = box.height() + padding * 2;
            }

            function setPos(top, left) {
                var fixTop, fixLeft, maxTop = $document.height() - height + mTop, maxLeft = $document.width() - width + mLeft;
                fixTop = top < mTop ? mTop : top;
                fixTop = top > maxTop ? maxTop : fixTop;
                fixTop = fixTop < 0 ? 0 : fixTop;
                fixLeft = left < mLeft ? mLeft : left;
                fixLeft = left > maxLeft ? maxLeft : fixLeft;
                box.css({
                    top: fixTop + 'px',
                    left: fixLeft + 'px'
                });
            }

            element.on('mousedown', function (event) {
                init();
                event.preventDefault();
                sTop = parseInt(box.css('top').replace('px', ''));
                sLeft = parseInt(box.css('left').replace('px', ''));
                startX = event.pageX;
                startY = event.pageY;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            });

            function mousemove(event) {
                y = event.pageY - startY;
                x = event.pageX - startX;
                top = (sTop + y);
                left = (sLeft + x);
                setPos(top, left);
            }

            function mouseup() {
                $document.unbind('mousemove', mousemove);
                $document.unbind('mouseup', mouseup);
            }
        }
    }
}]);