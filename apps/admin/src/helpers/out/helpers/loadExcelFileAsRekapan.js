"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var zod_1 = require("zod");
function fillEmptySlotsWithUndefined(arr) {
  if (arr.length < 4) {
    console.log(arr.concat(new Array(4 - arr.length).fill(undefined)));
    return arr.concat(new Array(4 - arr.length).fill(undefined));
  } else {
    return arr;
  }
}
var rekapanRowSchema = zod_1.z
  .object({
    tanggal: zod_1.z.date(),
  })
  .merge(
    zod_1.z.object({
      alatNames: zod_1.z.record(
        zod_1.z.string().min(1),
        zod_1.z.number().optional()
      ),
    })
  );
var rekapanWorksheetSchema = zod_1.z.array(rekapanRowSchema);
var getCleanedWorksheetValues = function (worksheet) {
  var header;
  var cleanedWorksheet = worksheet
    .getSheetValues()
    .slice(1)
    .map(function (row, index) {
      if (!row) {
        throw new Error("Empty Row");
      }
      var initialUndefinedRemovedRow = row.slice(1);
      if (index === 0) {
        header = initialUndefinedRemovedRow;
        return header;
      }
      var filledWithUndefined = fillEmptySlotsWithUndefined(
        initialUndefinedRemovedRow
      );

      var asObject = {
        tanggal: new Date(filledWithUndefined[0]),
        alatNames: lodash_1.default.zipObject(
          header.slice(1),
          filledWithUndefined.slice(1)
        ),
      };
      return asObject;
    });

  return cleanedWorksheet;
};
var loadExcelFileAsRekapan = function (rekapan) {
  var worksheets = rekapan.worksheets;
  var worksheet = worksheets[0];
  if (worksheet === undefined) throw new Error("No worksheet found");
  var rows = getCleanedWorksheetValues(worksheet);
  var dataRows = rows.slice(1);

  var parsedRows = rekapanWorksheetSchema.parse(dataRows);

  return parsedRows;
  // for (const worksheet of worksheets) {
  // }
};
exports.default = loadExcelFileAsRekapan;
//# sourceMappingURL=loadExcelFileAsRekapan.js.map
