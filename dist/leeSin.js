/*!
 * @careteen/leesin v1.0.0
 * (c) 2019-2019 Careteen
 * Released under the MIT License.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global['@careteen/leesin'] = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    // 默认参数
    var Config = {
        // 上报地址
        reportUrl: 'http://localhost:10000',
        // 提交参数
        token: '',
        // app版本
        appVersion: '1.0.0',
        // 环境
        environment: 'production',
        // 脚本延迟上报时间
        outtime: 300,
        // 开启单页面？
        enableSPA: true,
        // 是否自动上报pv
        autoSendPv: true,
        // 是否上报页面性能数据
        isPage: true,
        // 是否上报ajax性能数据
        isAjax: true,
        // 是否上报页面资源数据
        isResource: true,
        // 是否上报错误信息
        isError: true,
        // 是否录屏
        isRecord: true,
        // 是否上报行为
        isBehavior: true,
        ignore: {
            ignoreErrors: [],
            ignoreUrls: [],
            ignoreApis: ['/api/v1/report/web', 'livereload.js?snipver=1', '/sockjs-node/info'],
        },
        behavior: {
            console: ['log', 'error'],
            click: true,
        },
        // 最长上报数据长度
        maxLength: 1000,
    };
    // 设置参数
    function setConfig(options) {
        Config = __assign(__assign({}, Config), options);
    }
    //# sourceMappingURL=index.js.map

    var noop = function () { };
    // 将{ method: 'get', state: '200' }转为?method=get&state=200
    var serialize = function (obj) {
        var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return str.join("&");
    };
    // 兼容warn
    var warn = function () {
        var e = "object" == typeof console ? console.warn : noop;
        try {
            var t = {
                warn: e
            };
            t.warn.call(t);
        }
        catch (n) {
            return noop;
        }
        return e;
    }();
    //# sourceMappingURL=index.js.map

    // 上报
    function report(e) {
        'res' === e.t ?
            send(e)
            : 'error' === e.t ? send(e)
                : 'behavior' === e.t ? send(e)
                    : 'health' === e.t && window && window.navigator && 'function' == typeof window.navigator.sendBeacon ? sendBeacon(e)
                        : send(e);
        return this;
    }
    // post上报
    function send(msg) {
        var _a;
        var body = msg[msg.t];
        delete msg[msg.t];
        var url = Config.reportUrl + "?" + serialize(msg);
        post(url, (_a = {},
            _a[msg.t] = body,
            _a));
        // new Image().src = `${Config.reportUrl}?${serialize(msg)}`
    }
    function post(url, body) {
        var XMLHttpRequest = window.__oXMLHttpRequest_ || window.XMLHttpRequest;
        if (typeof XMLHttpRequest === 'function') {
            try {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', url, !0);
                xhr.setRequestHeader('Content-Type', 'text/plain');
                xhr.send(JSON.stringify(body));
            }
            catch (e) {
                warn('[Inner Error] Failed to log, POST请求失败');
            }
        }
        else {
            warn('[Inner Error] Failed to log, 浏览器不支持XMLHttpRequest');
        }
    }
    // 健康检查上报
    function sendBeacon(e) {
        'object' == typeof e && (e = serialize(e));
        e = Config.reportUrl + "?" + e;
        window && window.navigator && 'function' == typeof window.navigator.sendBeacon
            ? window.navigator.sendBeacon(e)
            : warn('[arms] navigator.sendBeacon not surported');
    }
    //# sourceMappingURL=reporter.js.map

    function handlePerformance() {
        var cycleFreq = 100; // 循环轮询的时间
        var isOnload = false;
        var performance = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance;
        var Util = {
            addEventListener: function (name, callback, useCapture) {
                if (window.addEventListener) {
                    return window.addEventListener(name, callback, useCapture);
                }
                else if (window.attachEvent) {
                    return window.attachEvent('on' + name, callback);
                }
            },
            domready: function (callback) {
                if (isOnload === true) {
                    return void 0;
                }
                var timer = null;
                if (document.readyState === 'interactive') {
                    runCheck();
                }
                else if (document.addEventListener) {
                    document.addEventListener('DOMContentLoaded', function () {
                        runCheck();
                    }, false);
                }
                else if (document.attachEvent) {
                    document.attachEvent('onreadystatechange', function () {
                        runCheck();
                    });
                }
                function runCheck() {
                    if (performance.timing.domInteractive) {
                        clearTimeout(timer);
                        callback();
                    }
                    else {
                        timer = setTimeout(runCheck, cycleFreq);
                    }
                }
            },
            onload: function (callback) {
                var timer = null;
                if (document.readyState === 'complete') {
                    runCheck();
                }
                else {
                    Util.addEventListener('load', function () {
                        runCheck();
                    }, false);
                }
                function runCheck() {
                    if (performance.timing.loadEventEnd) {
                        clearTimeout(timer);
                        callback();
                        isOnload = true;
                    }
                    else {
                        timer = setTimeout(runCheck, cycleFreq);
                    }
                }
            }
        };
        var reportPerf = function (type) {
            if (!performance) {
                return void 0;
            }
            // 过滤无效数据；
            function filterTime(a, b) {
                return (a > 0 && b > 0 && (a - b) >= 0) ? (a - b) : undefined;
            }
            // append data from window.performance
            var timing = performance.timing;
            var perfData = {
                // 网络建连
                pervPage: filterTime(timing.fetchStart, timing.navigationStart),
                redirect: filterTime(timing.responseEnd, timing.redirectStart),
                dns: filterTime(timing.domainLookupEnd, timing.domainLookupStart),
                tcp: filterTime(timing.connectEnd, timing.connectStart),
                network: filterTime(timing.connectEnd, timing.navigationStart),
                // 网络接收
                send: filterTime(timing.responseStart, timing.requestStart),
                receive: filterTime(timing.responseEnd, timing.responseStart),
                request: filterTime(timing.responseEnd, timing.requestStart),
                // 前端渲染
                dom: filterTime(timing.domComplete, timing.domLoading),
                loadEvent: filterTime(timing.loadEventEnd, timing.loadEventStart),
                frontend: filterTime(timing.loadEventEnd, timing.domLoading),
                // 关键阶段
                load: filterTime(timing.loadEventEnd, timing.navigationStart),
                domReady: filterTime(timing.domContentLoadedEventStart, timing.navigationStart),
                interactive: filterTime(timing.domInteractive, timing.navigationStart),
                ttfb: filterTime(timing.responseStart, timing.navigationStart),
                // 检测阶段类型
                t: type
            };
            return perfData;
        };
        // 不触发
        // Util.domready(function () {
        //   let perfData = reportPerf('domready')
        //   report(perfData)
        // })
        Util.onload(function () {
            var perfData = reportPerf('onload');
            report(perfData);
        });
    }

    var LeeSin = /** @class */ (function () {
        function LeeSin(options) {
            this.init(options);
        }
        LeeSin.prototype.init = function (options) {
            if (options && !options.token) {
                console.warn('[Required]: token is required !');
                return;
            }
            setConfig(options);
            Config.isPage && this.sendPerf();
            Config.enableSPA && this.addListenRouterChange();
            Config.isError && this.addListenJs();
            Config.isAjax && this.addListenAjax();
            Config.isRecord && this.addRrweb();
            Config.isBehavior && this.addListenBehavior();
            Config.isResource && this.sendResource();
        };
        LeeSin.prototype.sendPerf = function () {
            handlePerformance();
        };
        LeeSin.prototype.addListenRouterChange = function () {
        };
        LeeSin.prototype.addListenJs = function () {
        };
        LeeSin.prototype.addListenAjax = function () {
        };
        LeeSin.prototype.addRrweb = function () {
        };
        LeeSin.prototype.addListenBehavior = function () {
        };
        LeeSin.prototype.sendResource = function () {
        };
        return LeeSin;
    }());
    //# sourceMappingURL=index.js.map

    return LeeSin;

})));
