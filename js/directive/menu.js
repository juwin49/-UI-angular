'use strict';
directive.directive('menu', ['config', '$location', function (config, location) {
    return {
        restrict: 'A',
        replace: true,
        link: function (scope, elem) {
            if (config.MENU_LIST) {
                var el = angular.element;
                var menu = '<ul class="menu">';
                angular.forEach(config.MENU_LIST, function (item) {
                    if (item.children) {
                        var submenu = '<ul class="submenu anim">';
                        angular.forEach(item.children, function (subitem) {
                            submenu += '<li><a href="' + subitem.url + '"><span>' + subitem.label + '</span></a></li>';
                        });
                        submenu += '</ul>';
                        menu += '<li><a><i class="i ' + item.icon + '"></i><span>' + item.label + '</span><b class="i anim arrow"></b></a><b></b>' + submenu + '</li>';
                    } else {
                        menu += '<li><a href="' + item.url + '"><i class="i ' + item.icon + '"></i><span>' + item.label + '</span></a><b></b></li>';
                    }
                });
                menu += '</ul>';
                menu = el(menu);

                var menu_item = el('li', menu);
                menu_item.bind('click', function (event) {
                    var self = el(this), submenu = self.children('.submenu');
                    if (submenu.length) {
                        self.toggleClass('open');
                    }
                    else {
                        menu_item.removeClass('active').removeClass('open');
                        self.addClass('active');
                        self.parent().hasClass('submenu') && self.parent().parent().addClass('active open');
                    }
                    event.stopPropagation();
                });
                elem.replaceWith(menu);

                scope.$on('$routeChangeSuccess', function () {
                    var path = '#' + location.$$path || '/dashboard';
                    var target = menu.find('a[href="' + path + '"]');
                    target.parent().click();
                });
            }
        }
    };
}]);