"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var log = function (prefix, color) {
    return function () {
        var rest = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rest[_i] = arguments[_i];
        }
        console.log(color.apply(void 0, [prefix].concat(rest)));
    };
};
var warn = log('[TINIFY][WARN]', chalk_1.default.yellow);
var info = log('[TINIFY][INFO]', chalk_1.default.green);
var note = log('[TINIFY][NOTE]', chalk_1.default.magenta);
var error = log('[TINIFY][ERROR]', chalk_1.default.red);
exports.default = { warn: warn, info: info, note: note, error: error };
