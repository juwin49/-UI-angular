'use strict';
controller.
    controller('form', ['$scope', '$timeout', 'dialog', function (scope, timeout, dialog) {
        scope.user = {
            age: 0,
            url: '',
            fruit: 0,
            negative: 0,
            money: 0,
            name: '',
            email: '',
            password: '',
            passwordConfirm: ''
        };
        scope.fruits = [
            {text: '香蕉', value: 1},
            {text: '苹果', value: 2},
            {text: '橘子', value: 3},
            {text: '雪梨雪梨雪梨雪梨', value: 4},
            {text: '香蕉', value: 5},
            {text: '苹果', value: 6},
            {text: '橘子', value: 7}
        ];
        scope.save = function () {
            dialog.process('正在保存中...');
            timeout(function () {
                dialog.success('保存成功!');
            }, 1000);
        };
    }]);