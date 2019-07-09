(function () {
    'use strict';

    var StringMask = (function () {
        var tokens = {
            '0': {pattern: /\d/, default: '0'},
            '9': {pattern: /\d/, optional: true},
            '#': {pattern: /\d/, optional: true, recursive: true},
            'S': {pattern: /[a-zA-Z]/},
            '$': {escape: true}
        };
        var isEscaped = function (pattern, pos) {
            var count = 0;
            var i = pos - 1;
            var token = {escape: true};
            while (i >= 0 && token && token.escape) {
                token = tokens[pattern.charAt(i)];
                count += token && token.escape ? 1 : 0;
                i--;
            }
            return count > 0 && count % 2 === 1;
        };
        var calcOptionalNumbersToUse = function (pattern, value) {
            var numbersInP = pattern.replace(/[^0]/g, '').length;
            var numbersInV = value.replace(/[^\d]/g, '').length;
            return numbersInV - numbersInP;
        };
        var concatChar = function (text, character, options) {
            if (options.reverse) return character + text;
            return text + character;
        };
        var hasMoreTokens = function (pattern, pos, inc) {
            var pc = pattern.charAt(pos);
            var token = tokens[pc];
            if (pc === '') return false;
            return token && !token.escape ? true : hasMoreTokens(pattern, pos + inc, inc);
        };
        var insertChar = function (text, char, position) {
            var t = text.split('');
            t.splice(position >= 0 ? position : 0, 0, char);
            return t.join('');
        };
        var StringMask = function (pattern, opt) {
            this.options = opt || {};
            this.options = {
                reverse: this.options.reverse || false,
                usedefaults: this.options.usedefaults || this.options.reverse
            };
            this.pattern = pattern;

            StringMask.prototype.process = function proccess(value) {
                if (!value) return '';
                value = value + '';
                var pattern2 = this.pattern;
                var valid = true;
                var formatted = '';
                var valuePos = this.options.reverse ? value.length - 1 : 0;
                var optionalNumbersToUse = calcOptionalNumbersToUse(pattern2, value);
                var escapeNext = false;
                var recursive = [];
                var inRecursiveMode = false;

                var steps = {
                    start: this.options.reverse ? pattern2.length - 1 : 0,
                    end: this.options.reverse ? -1 : pattern2.length,
                    inc: this.options.reverse ? -1 : 1
                };

                var continueCondition = function (options) {
                    if (!inRecursiveMode && hasMoreTokens(pattern2, i, steps.inc)) {
                        return true;
                    } else if (!inRecursiveMode) {
                        inRecursiveMode = recursive.length > 0;
                    }

                    if (inRecursiveMode) {
                        var pc = recursive.shift();
                        recursive.push(pc);
                        if (options.reverse && valuePos >= 0) {
                            i++;
                            pattern2 = insertChar(pattern2, pc, i);
                            return true;
                        } else if (!options.reverse && valuePos < value.length) {
                            pattern2 = insertChar(pattern2, pc, i);
                            return true;
                        }
                    }
                    return i < pattern2.length && i >= 0;
                };

                for (var i = steps.start; continueCondition(this.options); i = i + steps.inc) {
                    var pc = pattern2.charAt(i);
                    var vc = value.charAt(valuePos);
                    var token = tokens[pc];
                    if (!inRecursiveMode || vc) {
                        if (this.options.reverse && isEscaped(pattern2, i)) {
                            formatted = concatChar(formatted, pc, this.options);
                            i = i + steps.inc;
                            continue;
                        } else if (!this.options.reverse && escapeNext) {
                            formatted = concatChar(formatted, pc, this.options);
                            escapeNext = false;
                            continue;
                        } else if (!this.options.reverse && token && token.escape) {
                            escapeNext = true;
                            continue;
                        }
                    }

                    if (!inRecursiveMode && token && token.recursive) {
                        recursive.push(pc);
                    } else if (inRecursiveMode && !vc) {
                        if (!token || !token.recursive) formatted = concatChar(formatted, pc, this.options);
                        continue;
                    } else if (recursive.length > 0 && token && !token.recursive) {
                        // Recursive tokens most be the last tokens of the pattern
                        valid = false;
                        continue;
                    } else if (!inRecursiveMode && recursive.length > 0 && !vc) {
                        continue;
                    }

                    if (!token) {
                        formatted = concatChar(formatted, pc, this.options);
                        if (!inRecursiveMode && recursive.length) {
                            recursive.push(pc);
                        }
                    } else if (token.optional) {
                        if (token.pattern.test(vc) && optionalNumbersToUse) {
                            formatted = concatChar(formatted, vc, this.options);
                            valuePos = valuePos + steps.inc;
                            optionalNumbersToUse--;
                        } else if (recursive.length > 0 && vc) {
                            valid = false;
                            break;
                        }
                    } else if (token.pattern.test(vc)) {
                        formatted = concatChar(formatted, vc, this.options);
                        valuePos = valuePos + steps.inc;
                    } else if (!vc && token.default && this.options.usedefaults) {
                        formatted = concatChar(formatted, token.default, this.options);
                    } else {
                        valid = false;
                        break;
                    }
                }

                return {result: formatted, valid: valid};
            };

            StringMask.prototype.apply = function (value) {
                return this.process(value).result;
            };

            StringMask.prototype.validate = function (value) {
                return this.process(value).valid;
            };
        };

        StringMask.process = function (value, pattern, options) {
            return new StringMask(pattern, options).process(value);
        };

        StringMask.apply = function (value, pattern, options) {
            return new StringMask(pattern, options).apply(value);
        };

        StringMask.validate = function (value, pattern, options) {
            return new StringMask(pattern, options).validate(value);
        };

        return StringMask;
    }());

    function numberViewMask(decimals, decimalDelimiter, thousandsDelimiter) {
        var mask = '#' + thousandsDelimiter + '##0';

        if (decimals > 0) {
            mask += decimalDelimiter;
            for (var i = 0; i < decimals; i++) {
                mask += '0';
            }
        }

        return new StringMask(mask, {
            reverse: true
        });
    }

    function numberModelMask(decimals) {
        var mask = '###0';

        if (decimals > 0) {
            mask += '.';
            for (var i = 0; i < decimals; i++) {
                mask += '0';
            }
        }

        return new StringMask(mask, {
            reverse: true
        });
    }

    function clearDelimitersAndLeadingZeros(value) {
        var cleanValue = value.replace(/^0*/, '');
        cleanValue = cleanValue.replace(/[^0-9]/g, '');
        return cleanValue;
    }

    function prepareNumberToFormatter(value, decimals) {
        return clearDelimitersAndLeadingZeros((parseFloat(value)).toFixed(decimals));
    }

    function maxValidator(ctrl, value, limit) {
        var max = parseFloat(limit);
        var validity = ctrl.$isEmpty(value) || isNaN(max) || value <= max;
        ctrl.$setValidity('max', validity);
        return value;
    }

    function minValidator(ctrl, value, limit) {
        var min = parseFloat(limit);
        var validity = ctrl.$isEmpty(value) || isNaN(min) || value >= min;
        ctrl.$setValidity('min', validity);
        return value;
    }

    function preparePercentageToFormatter(value, decimals) {
        return clearDelimitersAndLeadingZeros((parseFloat(value) * 100).toFixed(decimals));
    }

    directive
        .directive('required', [function () {
            return {
                restrict: 'A',
                link: function (scope, elem,attr) {
                    ((elem.is('input')||elem.is('textarea')) && !angular.isDefined(attr['nomask'])) && elem.wrap('<div class="required"></div>');
                }
            };
        }])
        .directive('uiPercentageMask', ['$locale', '$parse', function ($locale, $parse) {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function (scope, element, attrs, ctrl) {
                    var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP,
                        thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP,
                        decimals = parseInt(attrs['uiPercentageMask']);

                    if (!ctrl) {
                        return;
                    }

                    if (angular.isDefined(attrs['uiHideGroupSep'])) {
                        thousandsDelimiter = '';
                    }

                    if (isNaN(decimals)) {
                        decimals = 2;
                    }
                    var numberDecimals = decimals + 2;
                    var viewMask = numberViewMask(decimals, decimalDelimiter, thousandsDelimiter),
                        modelMask = numberModelMask(numberDecimals);

                    ctrl.$formatters.push(function (value) {
                        if (!value) {
                            return value;
                        }

                        var valueToFormat = preparePercentageToFormatter(value, decimals);
                        return viewMask.apply(valueToFormat) + ' %';
                    });

                    function parse(value) {
                        if (!value) {
                            return value;
                        }

                        var valueToFormat = clearDelimitersAndLeadingZeros(value) || '0';
                        if (value.length > 1 && value.indexOf('%') === -1) {
                            valueToFormat = valueToFormat.slice(0, valueToFormat.length - 1);
                        }
                        var formatedValue = viewMask.apply(valueToFormat) + ' %';
                        var actualNumber = parseFloat(modelMask.apply(valueToFormat));

                        if (ctrl.$viewValue !== formatedValue) {
                            ctrl.$setViewValue(formatedValue);
                            ctrl.$render();
                        }

                        return actualNumber;
                    }

                    ctrl.$parsers.push(parse);

                    if (attrs['uiPercentageMask']) {
                        scope.$watch(attrs['uiPercentageMask'], function (decimals) {
                            if (isNaN(decimals)) {
                                decimals = 2;
                            }
                            numberDecimals = decimals + 2;
                            viewMask = numberViewMask(decimals, decimalDelimiter, thousandsDelimiter);
                            modelMask = numberModelMask(numberDecimals);

                            parse(ctrl.$viewValue || '');
                        });
                    }

                    if (attrs.min) {
                        ctrl.$parsers.push(function (value) {
                            var min = $parse(attrs.min)(scope);
                            return minValidator(ctrl, value, min);
                        });

                        scope.$watch('min', function (value) {
                            minValidator(ctrl, ctrl.$modelValue, value);
                        });
                    }

                    if (attrs.max) {
                        ctrl.$parsers.push(function (value) {
                            var max = $parse(attrs.max)(scope);
                            return maxValidator(ctrl, value, max);
                        });

                        scope.$watch('max', function (value) {
                            maxValidator(ctrl, ctrl.$modelValue, value);
                        });
                    }
                }
            };
        }])
        .directive('uiNumberMask', ['$locale', '$parse', function ($locale, $parse) {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function (scope, element, attrs, ctrl) {
                    var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP,
                        thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP,
                        decimals = $parse(attrs['uiNumberMask'])(scope);

                    if (!ctrl) {
                        return;
                    }

                    if (angular.isDefined(attrs['uiHideGroupSep'])) {
                        thousandsDelimiter = '';
                    }

                    if (isNaN(decimals)) {
                        decimals = 2;
                    }
                    var viewMask = numberViewMask(decimals, decimalDelimiter, thousandsDelimiter),
                        modelMask = numberModelMask(decimals);

                    function parse(value) {
                        if (!value) {
                            return value;
                        }

                        var valueToFormat = clearDelimitersAndLeadingZeros(value) || '0';
                        var formatedValue = viewMask.apply(valueToFormat);
                        var actualNumber = parseFloat(modelMask.apply(valueToFormat));

                        if (angular.isDefined(attrs['uiNegativeNumber'])) {
                            var isNegative = (value[0] === '-'),
                                needsToInvertSign = (value.slice(-1) === '-');

                            //only apply the minus sign if it is negative or(exclusive) needs to be negative
                            if (needsToInvertSign ^ isNegative) {
                                actualNumber *= -1;
                                formatedValue = '-' + formatedValue;
                            }
                        }

                        if (ctrl.$viewValue !== formatedValue) {
                            ctrl.$setViewValue(formatedValue);
                            ctrl.$render();
                        }

                        return actualNumber;
                    }

                    ctrl.$formatters.push(function (value) {
                        var prefix = '';
                        if (angular.isDefined(attrs['uiNegativeNumber']) && value < 0) {
                            prefix = '-';
                        }

                        if (!value) {
                            return value;
                        }

                        var valueToFormat = prepareNumberToFormatter(value, decimals);
                        return prefix + viewMask.apply(valueToFormat);
                    });

                    ctrl.$parsers.push(parse);

                    if (attrs['uiNumberMask']) {
                        scope.$watch(attrs['uiNumberMask'], function (decimals) {
                            if (isNaN(decimals)) {
                                decimals = 2;
                            }
                            viewMask = numberViewMask(decimals, decimalDelimiter, thousandsDelimiter);
                            modelMask = numberModelMask(decimals);

                            parse(ctrl.$viewValue || '');
                        });
                    }

                    if (attrs.min) {
                        ctrl.$parsers.push(function (value) {
                            var min = $parse(attrs.min)(scope);
                            return minValidator(ctrl, value, min);
                        });
                        scope.$watch(attrs.min, function (value) {
                            minValidator(ctrl, ctrl.$modelValue, value);
                        });
                    }

                    if (attrs.max) {
                        ctrl.$parsers.push(function (value) {
                            var max = $parse(attrs.max)(scope);
                            return maxValidator(ctrl, value, max);
                        });
                        scope.$watch(attrs.max, function (value) {
                            maxValidator(ctrl, ctrl.$modelValue, value);
                        });
                    }
                }
            };
        }])
        .directive('uiMoneyMask', ['$locale', '$parse', function ($locale, $parse) {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function (scope, element, attrs, ctrl) {
                    var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP,
                        thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP,
                        currencySym = $locale.NUMBER_FORMATS.CURRENCY_SYM,
                        decimals = parseInt(attrs['uiMoneyMask']);

                    if (!ctrl) {
                        return;
                    }

                    if (angular.isDefined(attrs['uiHideGroupSep'])) {
                        thousandsDelimiter = '';
                    }

                    if (isNaN(decimals)) {
                        decimals = 2;
                    }
                    var decimalsPattern = decimals > 0 ? decimalDelimiter + new Array(decimals + 1).join('0') : '';
                    var maskPattern = currencySym + ' #' + thousandsDelimiter + '##0' + decimalsPattern;
                    var moneyMask = new StringMask(maskPattern, {reverse: true});

                    ctrl.$formatters.push(function (value) {
                        if (!value) {
                            return value;
                        }

                        return moneyMask.apply(value.toFixed(decimals).replace(/[^\d]+/g, ''));
                    });

                    function parse(value) {
                        if (!value) {
                            return value;
                        }

                        var actualNumber = value.replace(/[^\d]+/g, '');
                        actualNumber = actualNumber.replace(/^[0]+([1-9])/, '$1');
                        var formatedValue = moneyMask.apply(actualNumber);

                        if (value !== formatedValue) {
                            ctrl.$setViewValue(formatedValue);
                            ctrl.$render();
                        }

                        return formatedValue ? parseInt(formatedValue.replace(/[^\d]+/g, '')) / Math.pow(10, decimals) : null;
                    }

                    ctrl.$parsers.push(parse);

                    if (attrs['uiMoneyMask']) {
                        scope.$watch(attrs['uiMoneyMask'], function (decimals) {
                            if (isNaN(decimals)) {
                                decimals = 2;
                            }
                            decimalsPattern = decimals > 0 ? decimalDelimiter + new Array(decimals + 1).join('0') : '';
                            maskPattern = currencySym + ' #' + thousandsDelimiter + '##0' + decimalsPattern;
                            moneyMask = new StringMask(maskPattern, {reverse: true});

                            parse(ctrl.$viewValue || '');
                        });
                    }

                    if (attrs.min) {
                        ctrl.$parsers.push(function (value) {
                            var min = $parse(attrs.min)(scope);
                            return minValidator(ctrl, value, min);
                        });

                        scope.$watch(attrs.min, function (value) {
                            minValidator(ctrl, ctrl.$modelValue, value);
                        });
                    }

                    if (attrs.max) {
                        ctrl.$parsers.push(function (value) {
                            var max = $parse(attrs.max)(scope);
                            return maxValidator(ctrl, value, max);
                        });

                        scope.$watch(attrs.max, function (value) {
                            maxValidator(ctrl, ctrl.$modelValue, value);
                        });
                    }
                }
            };
        }]);
})();