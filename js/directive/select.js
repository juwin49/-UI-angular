'use strict';
directive.directive('select', ['$q', '$parse', function (q, parse) {
    return {
        restrict: 'C',
        require: ['?ngModel', '?ngOptions'],
        link: function (scope, elem, attrs) {
            var model = attrs['ngModel'], option = attrs['ngOptions'];
            var ele = angular.element,
                self = ele(elem),
                text = attrs['ngOptionsText'] || 'text',
                value = attrs['ngOptionsValue'] || 'value',
                default_text = attrs['ngDefaultText'] || '请选择',
                span = ele('<span></span>'),
                ul = ele('<ul></ul>'),
                li = null,
                options = scope[option];

            var _model = parse(model);
            span.text(default_text);
            span.addClass('unsel tip');


            var build_options = function (item) {
                var _value = item[value], _text = item[text];
                li = ele('<li></li>');
                li.data('value', _value);
                li.text(_text);
                if (_model(scope) == _value) {
                    span.text(_text);
                    li.addClass('sel');
                }
                ul.append(li);
            };

            var attach_handle = function () {
                ul.children().bind('click', function (event) {
                    var _self = ele(this);
                    _self.addClass('sel').siblings().removeClass('sel');
                    scope.$apply(function () {
                        _model.assign(scope, _self.data('value'));
                    });
                    span.text(_self.text());
                    span.removeClass('tip');
                    _model(scope) || span.addClass('tip');
                    self.removeClass('on');
                    event.stopPropagation();
                });
            };

            if (angular.isArray(options)) {
                var def = q.defer();
                def.resolve(options);
                options = def.promise;
            }

            span.text("数据加载中...");
            options.then(function (result) {

                li = ele('<li></li>');
                li.data('value', undefined);
                li.text(default_text);
                ul.append(li);

                span.text(default_text);
                result = angular.isArray(result) ? result : result.data;
                angular.forEach(result, build_options);
                attach_handle();
            });


            self.addClass('unsel');
            self.attr('tabindex', 0);
            self.append(span);
            self.append(ul);

            self.width(ul.width() + 17);
            self.bind('click', function () {
                self.toggleClass('on');
            });
            self.bind('blur', function () {
                self.removeClass('on');
            });
        }
    };
}]);