'use strict';
controller.
    controller('dialog', ['$scope', 'dialog', function (scope, dialog) {
        scope.pare = "xxxxxxxxxxxx";
        scope.confirm = function () {
            dialog.confirm('您确定要删除此项吗!').then(function () {
                setTimeout(function () {
                    dialog.success('恭喜你，删除成功!');
                }, 1000);
                dialog.process('系统正在处理中,请稍后...');
            }, function () {
                dialog.error('抱歉，删除失败!');
            });
        };
        scope.warning = function () {
            dialog.warning('这里是一条警告信息!');
        };

        scope.info = function () {
            dialog.info('这里是一条提示信息!');
        };

        scope.error = function () {
            dialog.error('这里是一条错误信息!');
        };

        scope.process = function () {
            dialog.process('这里是一条处理信息!');
        };

        scope.success = function () {
            console.log(scope);
            dialog.success('这里是一条成功信息!');
        };

        scope.modal = function () {
            /*dialog.modal({
             title: '这里是标题',
             locals: scope,
             //template: '<h1 ng-bind="message" ng-click="show()"></h1>',
             templateUrl: 'views/magic/modal.html',
             controller: 'modal',
             width: 900
             });*/
            dialog.modal({
                width: 840,
                title: '添加人员',
                locals: scope,
                //template: '<h1 ng-bind="message" ng-click="show()"></h1>',
                templateUrl: 'views/magic/form.html',
                controller: 'form'
            });
        };
    }]);