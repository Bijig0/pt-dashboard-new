"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function cleanWorksheetName(str) {
    // Define a regular expression to match the characters to be replaced
    // The 'g' flag ensures all instances are replaced
    // ? : \ / [ ]   <-- These characters are invalid in ExcelJS worksheets and are to be replaced with whitespace
    var regex = /[\?:\/\\\[\]]/g;
    // Replace the matched characters with a whitespace
    var cleanedStr = str.replace(regex, " ");
    return cleanedStr;
}
exports.default = cleanWorksheetName;
//# sourceMappingURL=cleanWorksheetName.js.map