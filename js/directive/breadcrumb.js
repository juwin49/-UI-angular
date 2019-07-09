'use strict';
directive.directive('breadcrumb', ['$http', '$location', '$rootScope', 'config', function (http, location, root, config) {
    return {
        restrict: 'CA',
        replace: true,
        link: function (scope, elem) {
            var data = config.MENU_LIST, title_tail = ' - 后台管理demo';
            scope.$on('$locationChangeSuccess', function () {
                if (data) {
                    var arr = location.path().split("/");
                    var breadcrumb = '<i class="i dashboard"></i><a href="#/">仪表板</a>';
                    var split = '<span class="split">/</span>';
                    angular.forEach(data, function (item) {
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i] == item.name && arr[i] != 'dashboard') {
                                root.title = item.label + title_tail;
                                if (item.url) {
                                    breadcrumb += split + '/<a href="' + item.url + '">' + item.label + '</a>';
                                } else {
                                    breadcrumb += split + '<span>' + item.label + '</span>';
                                }
                                if (item.children) {
                                    angular.forEach(item.children, function (subitem) {
                                        for (var i = 0; i < arr.length; i++) {
                                            if (arr[i] == subitem.name) {
                                                root.title = subitem.label + title_tail;
                                                breadcrumb += split + '<a href="' + subitem.url + '">' + subitem.label + '</a>';
                                            }
                                        }
                                    })
                                }
                            }
                        }
                    });
                    breadcrumb += '';
                    elem.html(breadcrumb);
                }
            });
        }
    }
}]);
