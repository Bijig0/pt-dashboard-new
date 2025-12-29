"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isQueryError = exports.initialStokSchema = exports.hargaAlatSchema = exports.queryErrorSchema = exports.supabaseWorksheetDataSchema = exports.worksheetDataSchema = exports.alatNamesSchema = exports.alatNameSchema = exports.proyeksSchema = exports.proyekSchema = exports.companyNamesSchema = void 0;
var zod_1 = require("zod");
exports.companyNamesSchema = zod_1.z.array(zod_1.z.object({
    name: zod_1.z.string(),
}));
exports.proyekSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string(),
});
exports.proyeksSchema = zod_1.z.array(exports.proyekSchema);
exports.alatNameSchema = zod_1.z.object({
    name: zod_1.z.string(),
});
exports.alatNamesSchema = zod_1.z.array(exports.alatNameSchema);
exports.worksheetDataSchema = zod_1.z.array(zod_1.z.object({
    masuk: zod_1.z.coerce.number().optional(),
    keluar: zod_1.z.coerce.number().optional(),
    tanggal: zod_1.z.string(),
    company_name: zod_1.z.string(),
    alat_name: zod_1.z.string(),
}));
exports.supabaseWorksheetDataSchema = zod_1.z.array(zod_1.z.object({
    tanggal: zod_1.z.string(),
    masuk: zod_1.z.number().nullable(),
    keluar: zod_1.z.number().nullable(),
    company_name: zod_1.z.object({
        name: zod_1.z.string(),
    }),
    alat_name: zod_1.z.object({
        name: zod_1.z.string(),
    }),
}));
exports.queryErrorSchema = zod_1.z.object({
    message: zod_1.z.string(),
    code: zod_1.z.string(),
    hint: zod_1.z.string().nullable(),
    details: zod_1.z.string().nullable(),
});
exports.hargaAlatSchema = zod_1.z.array(zod_1.z.object({
    name: zod_1.z.string(),
    harga: zod_1.z.number(),
}));
exports.initialStokSchema = zod_1.z.array(zod_1.z.object({
    initial_stok: zod_1.z.number().nullable(),
}));
var isQueryError = function (error) {
    var result = exports.queryErrorSchema.safeParse(error);
    if (!result.success)
        throw result.error;
    return result.success;
};
exports.isQueryError = isQueryError;
//# sourceMappingURL=schemas.js.map