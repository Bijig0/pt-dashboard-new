"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveErrorType = exports.supabase = void 0;
var supabase_js_1 = require("@supabase/supabase-js");
var SUPABASE_URL = import.meta.env["VITE_SUPABASE_URL"];
var ANON_KEY = import.meta.env["VITE_SUPABASE_ANON_KEY"];
exports.supabase = (0, supabase_js_1.createClient)(SUPABASE_URL, ANON_KEY);
var errorType = {
    "23505": "Duplicated Row",
};
var retrieveErrorType = function (error) {
    if (!error.code)
        return error;
    if (!(error.code in errorType))
        return error;
    var code = error.code;
    return errorType[code];
};
exports.retrieveErrorType = retrieveErrorType;
//# sourceMappingURL=supabase.js.map