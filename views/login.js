'use strict';
controller.
    controller('login', ['$rootScope', '$scope', '$http', '$location', "$cookieStore", '$timeout', function (root, scope, http, location, cookie, timeout) {
        var userinfo = cookie.get("userinfo");
        root.fix = true;
        scope.info = {
            username: '',
            password: ''
        };
        scope.loading = false;
        scope.fail = false;
        scope.login = function () {
            scope.loading = true;
            userinfo && (scope.info.username = userinfo.UserName);
            timeout(function () {
                var userInfo = {
                    UserName: 'admin',
                    Avatar: 'demo.jpg'
                };
                cookie.put("userinfo", userInfo);
                root.userinfo = userInfo;
                root.avatar = 'image/' + root.userinfo.Avatar;
                location.path('/dashboard');
                toastr.success('欢迎登陆后台管理系统');
            }, 2000);
        };
        root.avatar = 'image/avatar.jpg';
        if (userinfo) {
            root.userinfo = userinfo;
            root.avatar = 'image/' + userinfo.Avatar;
        } else {
            root.userinfo = null;
        }
        scope.focus = function () {
            scope.fail = false;
        };
    }]);
