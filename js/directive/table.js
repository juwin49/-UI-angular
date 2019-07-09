'use strict';
directive.directive('table', ['$rootScope', '$compile', '$timeout', '$route', 'dialog', function (root, compile, timeout, route, dialog) {
    return {
        restrict: 'A',
        scope: {
            option: '='
        },
        link: function (scope, elem) {
            var ele = angular.element,
                option = scope.option,
                colcount = option.optional + option.columns.length,
                loading = '<tr ng-show="loading"><td colspan="' + colcount + '">数据加载中...</td></tr>',
                empty = '<tr ng-show="empty"><td colspan="' + colcount + '">暂无数据</td></tr>',
                item_height = option['item_height'] || 42,
                size = option.size,
                head = '',
                rows = '',
                tool = '',
                toolbox = '',
                page = '',
                win = angular.element(window);
            scope.pagehide = option['pagehide'] || false;

            elem.css({position: 'relative'});

            var time_handler = 0, height = win.height() - 270;

            var resize = function () {
                height = win.height() - 270;
                scope.size = parseInt(height / item_height) || 1;
                timeout.cancel(time_handler);
                time_handler = timeout(function () {
                    route.updateParams(angular.extend(route.current.params, {page: 1, size: scope.size}));
                }, 1000);
            };

            win.on('resize', resize);
            scope.size = parseInt(height / item_height) || 1;

            elem.on('$destroy', function () {
                win.off('resize', resize);
            });

            var build_head = function () {
                head = '';
                if (option.optional) {
                    head += '<th class="center" style="width: 20px;"><label class="checkbox" ng-hide="loading||data.length==0"><input type="checkbox" ng-model="selected" ng-click="checkall()" /><i></i></label></th>';
                }
                angular.forEach(option.columns, function (item) {
                    head += '<th ng-class="{sort:sort,asc:order,desc:!order}">' + item.title + '</th>';
                });
                head = '<tr>' + head + '</tr>';
            };

            var build_rows = function () {
                rows = '';
                if (option.optional) {
                    rows += '<td class="center"><label class="checkbox" ng-click="check($event)"><input type="checkbox" ng-model="item.selected" /><i></i></label></td>';
                }
                angular.forEach(option.columns, function (item) {
                    if (angular.isFunction(item.filter)) {
                        rows += ' <td>' + item.filter() + '</td>';
                    } else {
                        rows += ' <td ng-bind-html="item.' + item.field + (item.filter ? '|' + item.filter : '') + '"></td>';
                    }
                });
                rows = '<tr ng-repeat="item in data" ng-click="select(item)" ng-contextmenu="contextmenu" ng-class="{selected:item.selected}">' + rows + '</tr>';
            };

            var build_page = function () {
                page = '<div class="page" ng-hide="empty||pagehide"><a class="unsel i first" title="首页" ng-click="first()"></a><a class="unsel i prev" title="上一页" ng-click="prev()"></a><span>|</span>第<input type="text" class="input" ng-model="params.page" data-inputmask="\'alias\': \'numeric\'" ng-keydown="go()"/>页<span>|</span><a class="unsel i next" title="下一页" ng-click="next()"></a><a class="unsel i last" title="尾页" ng-click="last()"></a></div>'
            };

            var build_tool = function () {
                var tool_item = '<a ng-repeat="item in option.toolbox" class="button" ng-click="action(item)"><i class="i {{item.icon}}" ng-show="item.icon"></i>{{item.text}}</a>';

                tool = '<div class="tool anim" ng-class="{on:showtool}">' + tool_item + '</div>';
            };

            var build_toolbox = function () {
                toolbox = '<div class="toolbox anim" fixbar><div class="inner">' + tool + page + '</div></div>';
            };

            build_head();
            build_rows();
            build_page();
            build_tool();
            build_toolbox();

            var table = '<table class="table">' + head + loading + rows + '</table>' + toolbox;

            scope.data = [];
            scope.selected = false;
            scope.loading = true;
            scope.empty = false;
            scope.showtool = false;
            scope.maxpage = 1;
            scope.params = angular.extend({page: 1, size: scope.size}, route.current.params);

            //修正页码
            var fixpage = function () {
                scope.params.page = +scope.params.page;
                (isNaN(scope.params.page) || scope.params.page < 1) && (scope.params.page = 1);
            };

            fixpage();

            //分页功能
            scope.first = function () {
                scope.params.page = 1;
                route.updateParams(scope.params);
            };
            scope.prev = function () {
                (scope.params.page > 1) && scope.params.page--;
                route.updateParams(scope.params);
            };
            scope.next = function () {
                (scope.params.page < scope.maxpage) && scope.params.page++;
                route.updateParams(scope.params);
            };
            scope.last = function () {
                scope.params.page = scope.maxpage;
                route.updateParams(scope.params);
            };
            scope.go = function () {
                if (event.keyCode == 13) {
                    fixpage();
                    route.updateParams(scope.params);
                }
            };

            //全选功能
            scope.$watch('data', function (data) {
                var count = 0;
                angular.forEach(data, function (item) {
                    item.selected && count++;
                });
                scope.showtool = count;
                scope.selected = count == data.length;
            }, true);
            scope.check = function (e) {
                //主要为了防止事件冒泡
                e.stopPropagation();
            };
            scope.checkall = function () {
                angular.forEach(scope.data, function (item) {
                    item.selected = scope.selected;
                });
            };
            scope.contextmenu = option.contextmenu || [];

            //操作功能
            scope.select = function (item) {
                var _item = angular.copy(item);
                delete _item['$$hashKey'];
                delete _item['selected'];
                option.select && option.select(_item);
            };
            scope.action = function (item) {
                var callback = item.callback, tip = item.tip, success = (item.success || '处理成功'), fail = (item.fail || '处理失败');
                var process = function () {
                    dialog.process('正在处理中...');
                    var select_items = [];
                    angular.forEach(scope.data, function (item) {
                        item.selected && select_items.push(item);
                    });
                    if (callback) {
                        callback(select_items).then(function () {
                            dialog.success(success).then(function () {
                                route.reload();
                            });
                        }, function (msg) {
                            dialog.error(fail + (msg ? ':' + msg : ''));
                        });
                    } else {
                        dialog.warning('没有任何处理!');
                    }
                };
                if (tip) {
                    dialog.confirm(tip).then(function () {
                        process();
                    });
                } else {
                    process();
                }
            };

            //获取数据
            size && (scope.params.size = size);
            option.data(scope.params).success(function (data) {
                scope.loading = false;
                if (data && data['list0']) {
                    var list = data['list0'];
                    angular.forEach(list || [], function (item) {
                        item.selected = false;
                    });
                    scope.empty = list.length == 0;
                    scope.data = list;
                    scope.allcount = data.allcount;

                    scope.maxpage = parseInt(((+data.allcount + (+scope.params.size) - 1) / (+scope.params.size)));
                } else {
                    scope.empty = true;
                    scope.data = [];
                    scope.allcount = 0;
                    toastr.error('数据加载失败:' + data.message);
                }

                scope.$broadcast('change');
            });

            elem.append(ele(compile(table)(scope)));
        }
    };
}]);