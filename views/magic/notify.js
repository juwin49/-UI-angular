'use strict';
controller.
    controller('notify', ['$scope', function (scope) {
        scope.warning = function () {
            toastr.warning('这里是一条警告信息!');
        };
        scope.info = function () {
            toastr.info('这里是一条提示信息!');
        };
        scope.error = function () {
            toastr.error('这里是一条错误信息!');
        };
        scope.success = function () {
            toastr.success('这里是一条成功信息!');
        };
    }]);