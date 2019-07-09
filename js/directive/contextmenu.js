'use strict';
directive
    .directive('ngContextmenu', ['$compile', '$timeout', function (compile, timeout) {
        return {
            restrict: 'A',
            link: function (scope, elem, attr) {

                var ele = angular.element,
                    body = ele('body'),
                    ul = ele('.contextmenu', body);
                if (ul.length == 0) {
                    ul = ele('<ul class="contextmenu"></ul>');
                    ul.attr('tabindex', 1);
                    ul.bind('blur', function () {
                        ul.hide();
                        ele("tr[ng-contextmenu]").removeClass('on');
                    });
                    body.append(ul);
                }

                elem.bind('contextmenu', function (e) {
                    ele("tr[ng-contextmenu]").removeClass('on');
                    elem.addClass('on');
                    scope.action = function (e, item) {
                        e.preventDefault();
                        item.callback(scope.item);
                        ul.hide();
                    };
                    scope.$apply(function () {
                        e.preventDefault();
                        var li = '<li ng-repeat="item in ' + attr['ngContextmenu'] + '" ng-click="action($event,item)"><a class="unsel"><i class="i {{item.icon}}"></i><span ng-bind="item.text"></span></a></li>';
                        ul.children().detach();
                        ul.html('');
                        ul.css({left: e.pageX, top: e.pageY});
                        ul.append(ele(compile(li)(scope)));
                        ul.show();
                        ul.focus();
                        //var fn = parse(attr['ngContextmenu']);
                        //fn(scope, { $event: event });
                    });
                });
            }
        };
    }]);