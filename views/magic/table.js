'use strict';
controller.
    controller('table', ['$scope', '$http', '$route', '$timeout', 'dialog', function (scope, http, route, timeout, dialog) {
        scope.condition = {
            dept: '',
            isactive:true,
            account: '',
            time: '2014-11-10'
        };
        angular.extend(scope.condition, route.current.params);
        scope.option = {
            optional: 1,
            columns: [
                {title: '部门', field: 'dept', sort: 1, order: 0},
                {title: '账号', field: 'account', sort: 0, order: 0},
                {title: '姓名', field: 'name', sort: 0, order: 0},
                {title: '性别', field: 'sex', sort: 0, order: 0},
                {title: '角色', field: 'rolename', sort: 0, order: 0, filter: 'sex'},
                {title: '线路权限', field: 'lname', sort: 0, order: 0,  filter: function () { return '<b style="color:red" ng-bind="item.lname+item.rolename"></b>' } },
                {title: '门禁卡号', field: 'cardid', sort: 0, order: 0},
                {title: '状态', field: 'state', sort: 0, order: 0}
            ],
            contextmenu: [
                {
                    text: '添加设备',
                    icon: 'add',
                    callback: function (item) {
                        console.log(item);
                        dialog.info('你可以在这里添加设备');
                    }
                },
                {
                    text: '删除该用户',
                    icon: 'del',
                    callback: function (item) {
                        console.log(item);
                        dialog.warning('你确定要删除用户 <b>' + item.name + '</b> 吗?');
                    }
                },
                {
                    text: '禁用该用户',
                    icon: 'cancel',
                    callback: function (item) {
                        console.log(item);
                        dialog.info('你可以在这里禁用该用户');
                    }
                },
                {
                    text: '给用户授权',
                    callback: function (item) {
                        console.log(item);
                        dialog.info('你可以在这里给用户授权');
                    }
                }
            ],
            toolbox: [
                {
                    text: '删除所选项',
                    icon: 'del',
                    success: '删除成功',
                    fail: '删除失败',
                    callback: function (items) {
                        console.dir(items);
                        return http.get('/data.json');
                    }
                },
                {
                    text: '停用所选人员',
                    icon: 'cancel',
                    tip: '确定停用所选人员吗?',
                    success: '停用成功',
                    fail: '停用失败',
                    callback: function (items) {
                        console.dir(items);
                        return http.get('/data.json');
                    }
                }
            ],
            data: function (param) {
                return http.get('/data.json', {params: param, cache: false});
            },
            select: function (item) {
                console.log(item);
                dialog.info('你可以在这里点击功能');
            }
        };
        scope.search = function () {
            route.updateParams(angular.extend(route.current.params, scope.condition));
        };
        scope.reload = function () {
            route.reload();
        };
        scope.add = function () {
            dialog.info('你可以在这里添加功能');
        }
    }]);