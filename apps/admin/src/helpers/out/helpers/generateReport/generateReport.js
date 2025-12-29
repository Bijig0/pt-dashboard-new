"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformListingToReportShape =
  exports.toFinalOutput =
  exports.getSums =
  exports.groupByCompanyName =
    void 0;
var exceljs_1 = require("exceljs");
var cleanWorksheetName_1 = require("../cleanWorksheetName");
var isMainModule_1 = require("../isMainModule");
var listingData_1 = require("./listingData");
var groupByCompanyName = function (records) {
  // const final = group(records, ({ company_name: { name } }) => name);
  var _a, _b;
  var result = [];
  var _loop_1 = function (record) {
    if (
      !result.some(function (each) {
        return each.company_name === record.company_name.name;
      })
    ) {
      result.push({
        company_name: record.company_name.name,
        alats: [],
      });
    }
    var company = result.find(function (each) {
      return each.company_name === record.company_name.name;
    });
    company.alats.push({
      alat_name: record.alat_name.name,
      tanggal: record.tanggal,
      masuk: (_a = record.masuk) !== null && _a !== void 0 ? _a : 0,
      keluar: (_b = record.keluar) !== null && _b !== void 0 ? _b : 0,
    });
  };
  for (var _i = 0, records_1 = records; _i < records_1.length; _i++) {
    var record = records_1[_i];
    _loop_1(record);
  }
  return result;
};
exports.groupByCompanyName = groupByCompanyName;
var getSums = function (input) {
  // Intermediate object that sums the 'masuk' and 'keluar' fields for each 'alat_name'
  var finalResult = {};
  for (var _i = 0, input_1 = input; _i < input_1.length; _i++) {
    var company = input_1[_i];
    var alats = company.alats;
    var newCompany = alats.reduce(function (acc, alat) {
      if (!acc[alat.alat_name]) {
        acc[alat.alat_name] = {
          prevBulanSewaAlatAmount: 0,
          currentBulanSewaAlatAmount: 0,
        };
      }
      var masukIsPresent = alat.masuk !== 0 && alat.masuk !== null;
      var alatMasukFormatted = Math.abs(alat.masuk) * -1;
      var amountToAdd = masukIsPresent ? alatMasukFormatted : alat.keluar;
      acc[alat.alat_name].currentBulanSewaAlatAmount += amountToAdd;
      return acc;
    }, {});
    finalResult[company.company_name] = newCompany;
  }
  // Transform the intermediate object into the desired output format
  // const output = Object.entries(intermediate).map(([alatName, amounts]) => ({
  //   alatName,
  //   ...amounts,
  // }));
  return finalResult;
};
exports.getSums = getSums;
var toFinalOutput = function (groupedByCompanyName) {
  var result = [];
  for (
    var _i = 0, groupedByCompanyName_1 = groupedByCompanyName;
    _i < groupedByCompanyName_1.length;
    _i++
  ) {
    var company = groupedByCompanyName_1[_i];
    var records_2 = [];
    var _loop_2 = function (alat) {
      if (
        !records_2.some(function (each) {
          return each.tanggal === alat.tanggal;
        })
      ) {
        records_2.push({
          tanggal: alat.tanggal,
          alats: [],
        });
      }
      var record = records_2.find(function (each) {
        return each.tanggal === alat.tanggal;
      });
      record.alats.push({
        name: alat.alat_name,
        colIndex: "",
        masuk: alat.masuk,
        keluar: alat.keluar,
      });
    };
    for (var _a = 0, _b = company.alats; _a < _b.length; _a++) {
      var alat = _b[_a];
      _loop_2(alat);
    }
    result.push({
      company_name: company.company_name,
      records: records_2,
    });
  }

  // Do the below code but make it fully immutable
  var withAlatNamesCompanies = [];
  for (var _c = 0, result_1 = result; _c < result_1.length; _c++) {
    var company = result_1[_c];
    var alatNames = [];
    for (var _d = 0, _e = company.records; _d < _e.length; _d++) {
      var record = _e[_d];
      var _loop_3 = function (alat) {
        if (
          !alatNames.some(function (each) {
            return each.name === alat.name;
          })
        ) {
          alatNames.push({
            name: alat.name,
            colIndex: alatNames.length,
          });
        }
      };
      for (var _f = 0, _g = record.alats; _f < _g.length; _f++) {
        var alat = _g[_f];
        _loop_3(alat);
      }
    }
    withAlatNamesCompanies.push({
      company_name: company.company_name,
      alatNames: alatNames,
      records: company.records,
    });
  }
  return withAlatNamesCompanies;
};
exports.toFinalOutput = toFinalOutput;
var transformListingToReportShape = function (records) {
  console.log("records: ".concat(JSON.stringify(records)));
  var groupedByCompanyName = (0, exports.groupByCompanyName)(records);

  var mySums = (0, exports.getSums)(groupedByCompanyName);

  var finalGroupedByAlats = (0, exports.toFinalOutput)(groupedByCompanyName);

  return finalGroupedByAlats;
};
exports.transformListingToReportShape = transformListingToReportShape;
var generateReport = function (records) {
  var finalGroupedByAlats = (0, exports.transformListingToReportShape)(records);
  var convertWorkbookShapeToExcel = function () {
    var _a;
    var workbook = new exceljs_1.default.Workbook();
    for (
      var _i = 0, finalGroupedByAlats_1 = finalGroupedByAlats;
      _i < finalGroupedByAlats_1.length;
      _i++
    ) {
      var company = finalGroupedByAlats_1[_i];
      var worksheetName = (0, cleanWorksheetName_1.default)(
        company.company_name
      );
      var worksheet = workbook.addWorksheet(worksheetName);
      worksheet.columns = company.alatNames.map(function (alatName) {
        return {
          header: alatName.name,
          key: alatName.name,
          width: 10,
        };
      });
      worksheet.columns = __spreadArray(
        [{ header: "Tanggal", key: "Tanggal" }],
        worksheet.columns,
        true
      );
      for (var _b = 0, _c = company.records; _b < _c.length; _b++) {
        var record = _c[_b];
        // add tanggal cell
        var row = {
          Tanggal: record.tanggal,
        };
        for (var _d = 0, _e = record.alats; _d < _e.length; _d++) {
          var alat = _e[_d];
          if (alat.masuk !== 0 && alat.keluar !== 0)
            throw new Error(
              "Masuk and Keluar present, should be one or the other"
            );
          var alatMasukFormatted = Math.abs(alat.masuk) * -1;
          var toWrite = alat.masuk !== 0 ? alatMasukFormatted : alat.keluar;
          row = __assign(
            __assign({}, row),
            ((_a = {}), (_a[alat.name] = toWrite), _a)
          );
        }
        worksheet.addRow(row);
      }
    }
    return workbook;
  };
  return convertWorkbookShapeToExcel();
};
if (isMainModule_1.isMainModule) {
  generateReport(listingData_1.records);
}
exports.default = generateReport;
//# sourceMappingURL=generateReport.js.map
