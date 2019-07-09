'use strict';
controller.
    controller('modal', ['$scope','dialog',function (scope,dialog) {
        scope.text = "请点我看看(^-^)";
        scope.show = function(){
            dialog.success(scope.input);
        };
    }]);