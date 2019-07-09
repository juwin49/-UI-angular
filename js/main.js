'use strict';
angular.module('sanwik', [
    'ngRoute',
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngSanitize',
    'sanwik.config',
    'sanwik.filter',
    'sanwik.service',
    'sanwik.directive',
    'sanwik.controller'
]).config(['$routeProvider', '$httpProvider', 'config', function (route, http, config) {
    route.when('/login', {templateUrl: 'views/login.html', controller: 'login'});
    var build_route = function (list, first) {
        angular.forEach(list, function (item) {
            var url = item.url, children = item.children, template = item.template, controller = item.controller;
            if (url) {
                url = url.replace('#', '');
                route.when(url, {
                    templateUrl: template, controller: controller, resolve: {
                        delay: function ($q, $timeout) {
                            var delay = $q.defer();
                            $timeout(delay.resolve, 0);
                            return delay.promise;
                        }
                    }
                });
                if (first) {
                    first = false;
                    route.otherwise({redirectTo: url});
                }
            }
            children && build_route(children);
        });
    };
    build_route(config.MENU_LIST, true);

    //对http请求一个全局处理
    http.interceptors.push(['$q', '$location', function ($q, location) {
        return {
            responseError: function (rejection) {
                if (!rejection.config.ignoreAuthModule) {
                    switch (rejection.status) {
                        case 401:
                            location.path('/login');
                            break;
                        case 403:
                            location.path('/login');
                            break;
                    }
                }
                return $q.reject(rejection);
            }
        };
    }]);
}]).run(['$rootScope', '$http', '$location', '$cookieStore', function (root, http, location, cookie) {
    root.min = false;
    root.title = '后台管理demo';
    root.animate = true;
    root.$on('$routeChangeStart', function (evt, next, current) {
        if (next && current) {
            root.animate = next.originalPath != current.originalPath && next.originalPath != '/login';
        } else if (next) {
            root.animate = next.originalPath != '/login';
        } else {
            root.animate = true;
        }
        root.loading = true;
    });
    root.$on('$routeChangeSuccess', function () {
        root.loading = false;
        root.fix = false;
    });
    root.$on('$routeChangeError', function () {
        root.loading = false;
        toastr.error('页面加载失败!')
    });
    root.$on('$routeChangeError', function () {
        root.loading = false;
        toastr.error('页面加载失败!')
    });
    root.logout = function () {
        http.get('/data/logout').success(function (result) {
            cookie.remove('userinfo');
            location.path('/login');
        });
    };
    root.lock = function () {
        http.get('/data/logout').success(function (result) {
            location.path('/login');
        });
    };
    root.avatar = 'image/avatar.jpg';
    root.userinfo = cookie.get('userinfo');
    if (root.userinfo) {
        root.avatar = 'image/' + root.userinfo.Avatar;
    } else {
        location.path('/login');
    }
    //toastr.info('欢迎使用珠海公交后台管理系统!');
}]);
