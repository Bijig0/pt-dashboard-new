import { addRekapanHeader } from "./createRekapanJS/addRekapanHeader/addRekapanHeader";
export type CompanyName = string & {};
export type AlatName = string & {};
export type Tanggal = string & {};

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

// // Assuming CompanyName, Tanggal, and AlatName are strings
// const CompanyNameSchema = z.string();
// const TanggalSchema = z.string();
// const AlatNameSchema = z.string();

// // Define the schema for a single record
// const recordSchema = z.object({
//   tanggal: z.string(),
//   stokDifference: z.number().nullable(),
//   masuk: z.number().nullable(),
//   keluar: z.number().nullable(),
//   alatName: AlatNameSchema,
//   companyName: CompanyNameSchema,
// });

// // Define the schema for the records grouped by Tanggal
// const recordsByTanggalSchema = z.record(TanggalSchema, z.array(recordSchema));

// // Define the schema for the records grouped by CompanyName
// export const recordsByCompanyNameSchema = z.record(
//   CompanyNameSchema,
//   z.object({
//     records: recordsByTanggalSchema,
//   })
// );

// // This and rekapan workbook body are the same except rekapan workbook body is a prettified version
// export type RecordsByCompanyNameSchema = z.infer<
//   typeof recordsByCompanyNameSchema
// >;

export type WorksheetRecord = {
  tanggal: string;
  stokDifference: number;
  masuk: number | null;
  keluar: number | null;
  alatName: AlatName;
  companyName: CompanyName;
};

export type RekapanWorkbookBody = {
  [key: CompanyName]: {
    records: WorksheetRecord[];
  };
};

// assert<Equals<RecordsByCompanyNameSchema, RekapanWorkbookBody>>();

export type RekapanWorkbook = ReturnType<typeof addRekapanHeader>;
