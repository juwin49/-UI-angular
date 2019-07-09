'use strict';
directive.directive('match', function () {
    return {
        require: '?ngModel',
        restrict: 'A',
        scope: {
            match: '='
        },
        link: function (scope, elem, attrs, ctrl) {
            if(!ctrl) { return; }

            scope.$watch(
                function() {
                    return (ctrl.$pristine && angular.isUndefined(ctrl.$modelValue)) || scope.match === ctrl.$modelValue;
                },
                function(currentValue) {
                    ctrl.$setValidity('match', currentValue);
                }
            );
        }
    };
});