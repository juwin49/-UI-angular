'use strict';
directive
    .directive('fixbar', ['$window', '$document', '$timeout', function (win, doc, timeout) {
        return {
            restrict: 'A',
            scope: {
                change: '&change'
            },
            link: function (scope, elem) {
                var getTop = function (e) {
                    var offset = e.offsetTop;
                    if (e.offsetParent != null) offset += getTop(e.offsetParent);
                    return offset;
                };

                var closeToBottom = false, ele = angular.element, _win = angular.element(win), _doc = ele(doc), height = elem.outerHeight(), _top = getTop(elem[0]) + height;
                var change = function () {
                    closeToBottom = _doc.height() - (_win.scrollTop() + _win.height()) > _doc.height() - _top;
                    var prev = elem.prev();
                    if (closeToBottom) {
                        elem.addClass('fixbar');
                        !prev.hasClass('placeholder') && ele('<div class="placeholder"></div>').height(height).insertBefore(elem);
                    } else {
                        elem.removeClass('fixbar');
                        prev.hasClass('placeholder') && prev.remove();
                    }
                };
                _win.on('scroll', change);
                _win.on('resize', change);
                elem.on('$destroy', function () {
                    _win.off('scroll', change);
                    _win.off('resize', change);
                });

                timeout(function () {
                    height = elem.outerHeight();
                    _top = getTop(elem[0]) + height;
                    change();
                }, 500);
                /*scope.$on('change', function () {
                    timeout(function () {
                        change();
                    }, 200);
                });*/
            }
        };
    }]);