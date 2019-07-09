service.factory('dialog', ['$q', '$http', '$compile', '$rootScope', '$templateCache', '$controller', function (q, http, compile, rootscope, templatecache, controller) {
    var ele = angular.element, body = ele('body');
    var success = ele('<div class="icon succ"><span class="line tip"></span><span class="line long"></span><div class="placeholder"></div><div class="fix"></div></div>');
    var error = ele('<div class="icon error"><span class="x-mark"><span class="line left"></span><span class="line right"></span></span></div>');
    var info = ele('<div class="icon info"></div>');
    var warning = ele('<div class="icon warn"><span class="body"></span><span class="dot"></span></div>');
    var process = ele('<div class="process"><div class="process-container"><span class="animated-process"></span></div></div>');

    var overlay = ele('<div class="dialog-overlay"></div>');
    var dialog = ele('<div class="dialog"></div>');
    var head = ele('<h2 draggable class="unsel"><span></span><a class="close">x</a></h2>');
    var content = ele('<div class="content"></div>');
    var btn_yes = ele('<a class="button btnpos">确定</a>');
    var btn_no = ele('<a class="button btnpos cancel">取消</a>');

    btn_no.bind('click', function () {
        hide_dialog();
    });

    btn_yes.bind('click', function () {
        hide_dialog();
    });

    ele('.close', head).bind('click', function () {
        hide_dialog();
    });

    dialog.append(head);
    dialog.append(success);
    dialog.append(error);
    dialog.append(info);
    dialog.append(warning);
    dialog.append(process);
    dialog.append(content);
    dialog.append(btn_no);
    dialog.append(btn_yes);

    body.append(overlay);
    body.append(dialog);

    compile(head)(rootscope.$new());

    var timehandle = null;
    var hide_dialog = function () {
        content.children().detach();
        overlay.fadeOut(100);
        dialog.removeClass('show-dialog').addClass('hide-dialog');
        timehandle = setTimeout(function () {
            dialog.hide();
            dialog.removeClass('full');
            timehandle = null;
        }, 280);
    };

    var show_dialog = function (text, type, config) {
        clearTimeout(timehandle);
        var deferred = q.defer();

        overlay.stop().fadeIn(100);
        content.html(text || '');
        dialog.attr('style', '');

        head.hide();
        success.hide();
        error.hide();
        info.hide();
        warning.hide();
        process.hide();
        btn_no.hide();
        btn_yes.hide();

        if (config) {
            var locals = config['locals'],
                template = config['template'],
                ctrl = config['controller'] || angular.noop,
                cache = config['cache'],
                width = config.width,
                height = config.height,
                pLeft = +dialog.css('paddingLeft').replace('px', ''),
                pRight = +dialog.css('paddingRight').replace('px', ''),
                full = config.full,
                html = '';
            full && dialog.addClass('full');
            ele('span', head).text(config.title || '');
            content.html('内容加载中...');
            height && dialog.height(height);
            width && dialog.width(width);
            width && dialog.css('marginLeft', -(width + pLeft + pRight) / 2);
            if (config.template) {
                var def = q.defer();
                def.resolve(config.template);
                html = def.promise;
            } else {
                html = http.get(config.templateUrl, {
                    cache: templatecache
                }).then(function (response) {
                    return response.data;
                });
            }
            html.then(function (html) {
                var element = ele(html);
                content.html(element);

                var scope = rootscope.$new(false);
                locals && (scope.parent = locals);
                controller(ctrl, {$scope: scope});
                compile(element)(scope);
            });
        }

        btn_no.bind('click', function () {
            deferred.reject();
        });
        btn_yes.bind('click', function () {
            deferred.resolve();
        });

        switch (type) {
            case 'info':
                info.show();
                btn_yes.show();
                break;
            case 'warning':
                warning.show();
                btn_yes.show();
                break;
            case 'success':
                success.show();
                btn_yes.show();
                break;
            case 'error':
                error.show();
                btn_yes.show();
                break;
            case 'process':
                process.show();
                break;
            case 'confirm':
                warning.show();
                btn_no.show();
                btn_yes.show();
                break;
            case 'modal':
                head.show();
                break;
        }

        dialog.show().removeClass('hide-dialog').addClass('show-dialog');
        return deferred.promise;
    };

    return {
        info: function (text) {
            return show_dialog(text, 'info');
        },
        error: function (text) {
            return show_dialog(text, 'error');
        },
        warning: function (text) {
            return show_dialog(text, 'warning');
        },
        success: function (text) {
            return show_dialog(text, 'success');
        },
        confirm: function (text) {
            return show_dialog(text, 'confirm');
        },
        process: function (text) {
            return show_dialog(text, 'process');
        },
        modal: function (config) {
            return show_dialog('', 'modal', config);
        }
    };
}]);