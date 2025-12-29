"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToSingleAlatRows = exports.groupByTanggalAndSign = void 0;
var radash_1 = require("radash");
function splitOnLastDash(str) {
  var lastIndex = str.lastIndexOf("-");
  var before = str.slice(0, lastIndex);
  var after = str.slice(lastIndex + 1);
  return [before, after];
}
var fillEmpty = function (input) {
  var result = {};
  var inverseRentType = {
    Sewa: "Retur",
    Retur: "Sewa",
  };

  for (var _i = 0, _a = Object.entries(input); _i < _a.length; _i++) {
    var _b = _a[_i],
      alatName = _b[0],
      afterGroupBy = _b[1];
    var filledAfterGroupBys = {};

    for (var _c = 0, _d = Object.entries(afterGroupBy); _c < _d.length; _c++) {
      var _e = _d[_c],
        key = _e[0],
        record = _e[1];

      filledAfterGroupBys[key] = record;
      var _f = splitOnLastDash(key),
        tanggal = _f[0],
        rentType = _f[1];
      var inverseKey = ""
        .concat(tanggal, "-")
        .concat(inverseRentType[rentType]);
      if (inverseKey in input) continue;
      filledAfterGroupBys[inverseKey] = undefined;
    }
    result[alatName] = filledAfterGroupBys;
  }
  return result;
};
var groupByTanggalAndJumlahSign = function (array) {
  return array.reduce(function (objectsByKeyValue, obj) {
    var keys = ["tanggal", "jumlah"];
    var tanggal = obj["tanggal"];
    var rentalType = obj["jumlah"] < 0 ? "Retur" : "Sewa";
    var value = "".concat(tanggal, "-").concat(rentalType);
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);

    return objectsByKeyValue;
  }, {});
};
function groupByTanggalAndSign(input) {
  var firstResult = {};
  for (var _i = 0, _a = Object.entries(input); _i < _a.length; _i++) {
    var _b = _a[_i],
      alatName = _b[0],
      alatRecord = _b[1];
    var groupedByTanggalAndJumlahSign = groupByTanggalAndJumlahSign(
      alatRecord.records
    );

    firstResult[alatName] = groupedByTanggalAndJumlahSign;
  }

  var final = fillEmpty(firstResult);
  console.log(JSON.stringify(final, null, 2));
  return final;
}
exports.groupByTanggalAndSign = groupByTanggalAndSign;
var convertToSingleAlatRows = function (input) {
  var toReturn = {};
  for (var _i = 0, input_1 = input; _i < input_1.length; _i++) {
    var row = input_1[_i];
    for (var _a = 0, _b = row.alatRecords; _a < _b.length; _a++) {
      var alatRecord = _b[_a];
      var alatName = alatRecord.alatName;
      if (!(alatName in toReturn)) {
        toReturn[alatName] = { records: [] };
      }
      var singleAlat = {
        tanggal: row.tanggal,
        jumlah: alatRecord.jumlahAlat,
        harga: alatRecord.harga,
      };
      toReturn[alatName].records.push(singleAlat);
    }
  }
  // Do a group by on the alat Name
  // In each group it should contain the SingleAlat rows
  return toReturn;
};
exports.convertToSingleAlatRows = convertToSingleAlatRows;
var date_fns_1 = require("date-fns");
var yyyy_mm_dd_formatDate_1 = require("./yyyy_mm_dd_formatDate");
function getDaysUntilEndOfMonth(date) {
  var totalDaysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  return totalDaysInMonth - date.getDate();
}
function getDaysFromStartOfMonth(date) {
  return date.getDate();
}
var performCalculations = function (input) {
  var result = {};
  for (var _i = 0, _a = Object.entries(input); _i < _a.length; _i++) {
    var _b = _a[_i],
      alatName = _b[0],
      alatInfo = _b[1];
    var records = [];
    var harga = void 0;
    for (var _c = 0, _d = Object.entries(alatInfo); _c < _d.length; _c++) {
      var _e = _d[_c],
        alatDetail = _e[0],
        alatValuesList = _e[1];

      if (alatValuesList === undefined) continue;
      for (
        var _f = 0, alatValuesList_1 = alatValuesList;
        _f < alatValuesList_1.length;
        _f++
      ) {
        var alatValues = alatValuesList_1[_f];
        var _g = splitOnLastDash(alatDetail),
          _1 = _g[0],
          rentalType = _g[1];
        var asDate = new Date(alatValues.tanggal);
        var days =
          rentalType === "Sewa"
            ? getDaysUntilEndOfMonth(asDate)
            : getDaysFromStartOfMonth(asDate);

        var tanggalStart =
          rentalType === "Sewa"
            ? alatValues.tanggal
            : (0, yyyy_mm_dd_formatDate_1.default)(
                (0, date_fns_1.endOfMonth)(asDate)
              );
        var tanggalEnd =
          rentalType === "Sewa"
            ? (0, yyyy_mm_dd_formatDate_1.default)(
                (0, date_fns_1.startOfMonth)(asDate)
              )
            : alatValues.tanggal;
        var total = days * alatValues.jumlah * alatValues.harga;
        harga = alatValues.harga;
        var record = {
          jumlah: alatValues.jumlah,
          total: total,
          days: days,
          tanggalRange: {
            start: tanggalStart,
            end: tanggalEnd,
          },
        };
        records.push(record);
      }
    }
    var fullAlatRecord = {
      records: records,
      subTotal: (0, radash_1.sum)(records, function (record) {
        return record.total;
      }),
      harga: harga,
    };
    result[alatName] = fullAlatRecord;
  }
  var jumlah = (0, radash_1.sum)(Object.values(result), function (each) {
    return each.subTotal;
  });
  if (jumlah === undefined) throw new Error("jumlah is undefined");
  var ppn = jumlah * 0.11;
  var finalResult = {
    data: result,
    jumlah: jumlah,
    ppn: ppn,
    total: jumlah - ppn,
  };
  return finalResult;
};
var exceljs_1 = require("exceljs");
var downloadExcelFile_1 = require("./downloadExcelFile");
var convertToExcelFile = function (input) {
  var workbook = new exceljs_1.default.Workbook();
  var worksheet = workbook.addWorksheet("FEBRI");
  var _loop_1 = function (alatName, alatDetails) {
    var records = alatDetails.records;
    var newRecords = records.map(function (record) {
      var periode = ""
        .concat(record.tanggalRange.start, " - ")
        .concat(record.tanggalRange.end);
      var lamaSewa = "".concat(record.days, " HR");
      var jumlahAlat = record.jumlah;
      var hargaSewa = alatDetails.harga;
      var total = record.total;
      return [null, periode, lamaSewa, jumlahAlat, hargaSewa, total, null];
    });

    newRecords[0][0] = alatName;
    newRecords[newRecords.length - 1][6] = alatDetails.subTotal;
    var bulananSewaAmount = "Sewa=".concat(Math.ceil(alatDetails.harga * 30));
    if (newRecords.length >= 2) {
      newRecords[1][0] = bulananSewaAmount;
    }
    worksheet.addRows(newRecords);
    if (newRecords.length < 2) {
      worksheet.addRow([bulananSewaAmount, null, null, null, null, null, null]);
    }
    worksheet.addRow([null, null, null, null, null, null, null]);
  };
  for (var _i = 0, _a = Object.entries(input.data); _i < _a.length; _i++) {
    var _b = _a[_i],
      alatName = _b[0],
      alatDetails = _b[1];
    _loop_1(alatName, alatDetails);
  }
  worksheet.addRow([
    "Jumlah",
    null,
    null,
    null,
    null,
    input.jumlah,
    input.jumlah,
  ]);
  worksheet.addRow(["PPN", null, null, null, null, null, input.ppn]);
  worksheet.addRow(["Total", null, null, null, null, null, input.total]);
  return workbook;
};
var bikinTagihan = function (input) {
  // Perform a group by on the date

  var alatAndTanggals = (0, exports.convertToSingleAlatRows)(input);

  var groupedInput = groupByTanggalAndSign(alatAndTanggals);

  var done = performCalculations(groupedInput);

  var asExcelFile = convertToExcelFile(done);
  (0, downloadExcelFile_1.default)(asExcelFile, "example-tagihan.xlsx");
};
exports.default = bikinTagihan;
// So the positives are all the same
// The negatives are all the same
// The per bulan is just calculated by I think the negatives subtracted but can do that at the end
// Yepp ONLY negatives so keep running total
// Also im doing a group by on date but what happens if there's a negative and positive on same date
// You do a group by on both columns
//# sourceMappingURL=generateTagihan.js.map
