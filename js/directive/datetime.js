'use strict';
directive
    .directive('datetime', [function () {
        return {
            restrict: 'A',
            scope: {
                option: '=timeoption'
            },
            link: function (scope, elem) {
                elem.wrap('<div class="time"></div>');
                elem.datetimepicker(angular.extend({
                    mask: true,
                    lazyInit: true
                }, scope.option || {}));
                elem.on('$destroy', function () {
                    angular.element('.xdsoft_datetimepicker').detach();
                });
            }
        };
    }])
    .directive('time', [function () {
        return {
            restrict: 'A',
            scope: {
                option: '=timeoption'
            },
            link: function (scope, elem) {
                elem.wrap('<div class="time"></div>');
                elem.datetimepicker(angular.extend({
                    mask: true,
                    datepicker: false,
                    format: 'H:i',
                    lazyInit: true,
                    closeOnDateSelect: true
                }, scope.option || {}));
                elem.on('$destroy', function () {
                    angular.element('.xdsoft_datetimepicker').detach();
                });
            }
        };
    }])
    .directive('date', [function () {
        return {
            restrict: 'A',
            scope: {
                option: '=timeoption'
            },
            link: function (scope, elem, attr) {
                var relate_start = angular.element(attr['relateStart']);
                var relate_end = angular.element(attr['relateEnd']);
                elem.wrap('<div class="time"></div>');
                elem.datetimepicker(angular.extend({
                    timepicker: false,
                    mask: true,
                    format: 'Y/m/d',
                    lazyInit: true,
                    closeOnDateSelect: true,
                    onShow: function () {
                        if (relate_start.length != 0) {
                            this.setOptions({
                                minDate: relate_start.val() ? relate_start.val() : false
                            });
                        }
                        if (relate_end.length != 0) {
                            this.setOptions({
                                maxDate: relate_end.val() ? relate_end.val() : false
                            });
                        }
                    }
                }, scope.option || {}));
                elem.on('$destroy', function () {
                    angular.element('.xdsoft_datetimepicker').detach();
                });
            }
        };
    }])
    .directive('unixtime', [function () {
        return {
            restrict: 'A',
            scope: {
                option: '=timeoption'
            },
            link: function (scope, elem) {
                elem.wrap('<div class="time"></div>');
                elem.datetimepicker(angular.extend({
                    mask: true,
                    format: 'unixtime',
                    lazyInit: true,
                    closeOnDateSelect: true
                }, scope.option || {}));
                elem.on('$destroy', function () {
                    angular.element('.xdsoft_datetimepicker').detach();
                });
            }
        };
    }]);