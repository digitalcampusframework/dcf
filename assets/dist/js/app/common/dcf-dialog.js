/**
 * @project        dcf
 * @author         Digital Campus Nebraska
 * @website        http://digitalcampus.us/
 * @copyright      Copyright (c) 2018, BSD-3-Clause
 *
 */
"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};!function(e,o){"function"==typeof define&&define.amd?define([],o):"object"===("undefined"==typeof exports?"undefined":_typeof(exports))?module.exports=o():e.dcfDialog=o()}(void 0,function(){return function(e){return[].slice.call(document.querySelectorAll(".dcf-js-dialog")).forEach(function(o){var t=o.querySelector(".dcf-js-dialog-trigger"),n=o.querySelector("dialog"),c=o.querySelector(".dcf-o-dialog__close");window.HTMLDialogElement||e.registerDialog(n),t.addEventListener("click",function(){n.showModal(),n.style.top="calc(50% - "+n.scrollHeight/2+"px)"}),c.addEventListener("click",function(){n.close("closed")}),n.addEventListener("cancel",function(){n.close("cancelled")}),o.addEventListener("click",function(e){e.target==n&&n.close("cancelled")})}),e}});
//# sourceMappingURL=dcf-dialog.js.map
