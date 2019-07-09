angular.module('sanwik.filter', []).
    filter('sex', function () {
        return function (input) {
            return input ? '男' : '女'
        }
    });