'use strict';
controller.
    controller('select', ['$scope', '$http', function (scope, http) {
        scope.fruits = [
            {text: '香蕉', value: 1},
            {text: '苹果', value: 2},
            {text: '橘子', value: 3},
            {text: '雪梨雪梨雪梨雪梨', value: 4},
            {text: '香蕉', value: 5},
            {text: '苹果', value: 6},
            {text: '橘子', value: 7}
        ];
        scope.fruit = 0;

        scope.fruits2 = http.get('/select.json');
    }]);
