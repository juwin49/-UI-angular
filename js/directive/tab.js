'use strict';
directive.directive('tab', ['$route', function (route) {
    return {
        restrict: 'A',
        replace: true,
        link: function (scope, elem, attr) {
            var el = angular.element, tab = el('li', elem), tabcontent = el('.tab-content', elem), tab_index = route.current.params['tab'];

            if (attr['tab']) {
                var params = route.current.params, path = route.current.originalPath;
                tab.each(function (index, item) {
                    el(item).children().attr('href', '#' + path + '?' + el.param(angular.extend(params, {tab: index})))
                });
                tab.eq(+tab_index).addClass('active').siblings().removeClass('active');
            } else {

                tab.bind('click', function () {
                    var self = el(this);
                    self.addClass('active').siblings().removeClass('active');
                    tabcontent.hide();
                    tabcontent.eq(self.index()).show();
                });
            }
        }
    };
}]);