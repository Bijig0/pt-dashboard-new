"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var radash_1 = require("radash");
var listingData_1 = require("./listingData");
var myGroupBy = function () {
    var input = listingData_1.records;
    var flattened = input.map(function (record) {
        return __assign(__assign({}, record), { company_name: record.company_name.name, alat_name: record.alat_name.name });
    });
    var withMasukAndKeluarFormatted = flattened.map(function (record) {
        var masukOrKeluarPresent = record.masuk !== 0 && record.masuk !== null ? "masuk" : "keluar";
        var alatMasukFormatted = Math.abs(record.masuk) * -1;
        var masuk = masukOrKeluarPresent === "masuk" ? alatMasukFormatted : 0;
        var keluar = masukOrKeluarPresent === "keluar" ? record.keluar : 0;
        var formattedMasukAndKeluar = __assign(__assign({}, record), { masuk: masuk, keluar: keluar });
        return formattedMasukAndKeluar;
    });
    var groupedByCompanyName = (0, radash_1.group)(withMasukAndKeluarFormatted, function (record) { return record.company_name; });
    var getSums = function (groupedByCompanyName) {
        var entries = Object.entries(groupedByCompanyName);
        entries.map(function (_a) {
            var _b, _c, _d, _e;
            var companyName = _a[0], alatRecordsForCompany = _a[1];
            var _f = [
                (_b = alatRecordsForCompany[0]) === null || _b === void 0 ? void 0 : _b.alat_name,
                (_c = alatRecordsForCompany[0]) === null || _c === void 0 ? void 0 : _c.masuk,
                (_d = alatRecordsForCompany[0]) === null || _d === void 0 ? void 0 : _d.keluar,
                (_e = alatRecordsForCompany[0]) === null || _e === void 0 ? void 0 : _e.tanggal,
            ], alatName = _f[0], masuk = _f[1], keluar = _f[2], tanggal = _f[3];
            var currentBulanSewaAlatAmount = (0, radash_1.sum)(alatRecordsForCompany, function (record) {
                return record.masuk !== 0 ? record.masuk : record.keluar;
            });
            return [companyName, {}];
        });
    };
};
//# sourceMappingURL=testing.js.map