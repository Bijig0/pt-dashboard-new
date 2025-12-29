"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var yyyy_mm_dd_formatDate = function (date) {
    var formattedDate = date.toISOString().split("T")[0];
    return formattedDate;
};
exports.default = yyyy_mm_dd_formatDate;
//# sourceMappingURL=yyyy_mm_dd_formatDate.js.map