'use strict';
angular.module('sanwik.config', []).constant('config', {
    MENU_LIST: [
        {
            "id": "role1",
            "label": "仪表板",
            "name": "dashboard",
            "icon": "dashboard",
            "url": "#/dashboard",
            "controller": "dashboard",
            "template": "views/dashboard.html"
        },
        {
            "id": "role2",
            "label": "UI工具包",
            "icon": "magic",
            "name": "magic",
            "children": [
                {
                    "id": "role3",
                    "label": "按钮",
                    "name": "button",
                    "url": "#/magic/button",
                    "controller": "button",
                    "template": "views/magic/button.html"
                },
                {
                    "label": "弹出窗口",
                    "id": "role4",
                    "name": "dialog",
                    "url": "#/magic/dialog",
                    "controller": "dialog",
                    "template": "views/magic/dialog.html"
                },
                {
                    "label": "tab选项卡",
                    "id": "role4",
                    "name": "tab",
                    "url": "#/magic/tab",
                    "controller": "tab",
                    "template": "views/magic/tab.html"
                },
                {
                    "label": "开关按钮",
                    "id": "role4",
                    "name": "switch",
                    "url": "#/magic/switch",
                    "controller": "switch",
                    "template": "views/magic/switch.html"
                },
                {
                    "label": "输入框",
                    "id": "role4",
                    "name": "input",
                    "url": "#/magic/input",
                    "controller": "input",
                    "template": "views/magic/input.html"
                },
                {
                    "label": "表单验证",
                    "id": "role4",
                    "name": "form",
                    "url": "#/magic/form",
                    "controller": "form",
                    "template": "views/magic/form.html"
                },
                {
                    "label": "下拉框",
                    "id": "role4",
                    "name": "select",
                    "url": "#/magic/select",
                    "controller": "select",
                    "template": "views/magic/select.html"
                },
                {
                    "label": "通知框",
                    "id": "role4",
                    "name": "notify",
                    "url": "#/magic/notify",
                    "controller": "notify",
                    "template": "views/magic/notify.html"
                },
                {
                    "label": "数据表",
                    "id": "role4",
                    "name": "table",
                    "url": "#/magic/table",
                    "controller": "table",
                    "template": "views/magic/table.html"
                }
            ]
        }
    ]
});