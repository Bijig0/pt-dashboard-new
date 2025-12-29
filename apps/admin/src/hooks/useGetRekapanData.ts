import dayjs from "dayjs";
import { Workbook, Worksheet } from "exceljs";
import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import * as R from "fp-ts/Record";
import { sequenceT } from "fp-ts/lib/Apply";
import * as E from "fp-ts/lib/Either";
import { Either } from "fp-ts/lib/Either";
import { fromEntries } from "fp-ts/lib/ReadonlyRecord";
import { flow, identity, pipe } from "fp-ts/lib/function";
import { ZodError, z } from "zod";
import {
  CleanedWorksheetRowSchema,
  CleanedWorksheetSchema,
  CurrentBulanTotalSewaAlatAmountSchema,
  PrevBulanTotalSewaAlatAmountSchema,
  WorksheetSchema,
  safeParseCurrentBulanTotalSewaAlatAmount,
  safeParsePrevBulanTotalSewaAlatAmount,
} from "../helpers/excel-types";
import { safeParseWorksheet } from "../helpers/excel/safeParseWorksheet";
import { objectValues } from "../helpers/objectValues";
import { safeParse } from "../helpers/safeParse";
import useGetRekeningExcelFile from "./useGetRekeningExcelFile";

const logAndReturn = <L, A>(e: E.Either<L, A>): E.Either<L, A> => {
  E.fold(
    (error) => {
      return E.left(error);
    },
    (value) => {
      return E.right(value);
    }
  )(e);
  return e; // Return the original Either for further processing
};

type RecordRow<Header extends string> = {
  [Key in Header]: any;
};

// Takes a header cell which contains a list of strings which are the 'headers'
// Then it creates a list of objects, where for each object it contains keys of said header
// and of value type any

// type ExcelFile<HeaderCell[] extends string[], RecordRow extends any[]> = {
//   header: string[]
//   records: any[]
// }

type ArrayToUnion<T extends string[]> = T[number];

type WorksheetAsObj<
  Header extends string[],
  RekapanRecordRow extends RecordRow<ArrayToUnion<Header>>,
> = {
  header: Header;
  records: RekapanRecordRow[];
};

type RekapanWorksheet<
  Header extends string[],
  RekapanRecordRow extends RecordRow<ArrayToUnion<Header>>,
> = WorksheetAsObj<Header, RekapanRecordRow>;

type StringArray = string[];

type WorksheetAsArrays<RecordRow extends (string | number)[] = any[]> = [
  StringArray,
  ...RecordRow[],
];

type RekapanRecordRow = {
  [Key in RekapanHeaderListSchema[number]]:
    | z.ZodString
    | z.ZodUnion<[z.ZodNumber, z.ZodUndefined]>;
};

type RekapanTotalSewaAlatAmountRow = {
  [Key in RekapanHeaderListSchema[number]]: z.ZodString | z.ZodNumber;
};

const createRekapanRecordRowSchema = (header: RekapanHeaderListSchema) => {
  const entries = pipe(
    header,
    A.map(
      (key) =>
        [
          key,
          key === "Tanggal" ? z.string() : z.number().or(z.undefined()),
        ] as const
    ),
    fromEntries
  ) satisfies RekapanRecordRow;

  return pipe(entries, z.object);
};

const createPrevBulanTotalSewaAlatAmountSchema = (
  header: RekapanHeaderListSchema
) => {
  const entries = pipe(
    header,
    A.map((key) => [key, key === "Tanggal" ? z.string() : z.number()] as const),
    fromEntries
  ) satisfies RekapanTotalSewaAlatAmountRow;

  return pipe(entries, z.object);
};

const createCurrentBulanTotalSewaAlatAmountSchema = (
  header: RekapanHeaderListSchema
) => {
  const entries = pipe(
    header,
    A.map((key) => [key, key === "Tanggal" ? z.string() : z.number()] as const),
    fromEntries
  ) satisfies RekapanTotalSewaAlatAmountRow;

  return pipe(entries, z.object);
};

const createRekapanWorksheetObjSchema = (header: RekapanHeaderListSchema) => {
  const rekapanRecordRowSchema = createRekapanRecordRowSchema(header);
  const prevBulanTotalSewaAlatAmountSchema =
    createPrevBulanTotalSewaAlatAmountSchema(header);
  const currentBulanTotalSewaAlatAmountSchema =
    createCurrentBulanTotalSewaAlatAmountSchema(header);

  return z.object({
    prevBulanTotalSewaAlatAmount: prevBulanTotalSewaAlatAmountSchema,
    currentBulanTotalSewaAlatAmount: currentBulanTotalSewaAlatAmountSchema,
    header: rekapanHeaderRowSchema,
    records: z.array(rekapanRecordRowSchema),
  });
};

type RekapanObjRecordRowSchema = z.infer<
  ReturnType<typeof createRekapanRecordRowSchema>
>;

export type RekapanWorksheetObjSchema = z.infer<
  ReturnType<typeof createRekapanWorksheetObjSchema>
>;

export type RekapanWorkbookObj = Record<CompanyName, RekapanWorksheetObjSchema>;

const dateObjectSchema = z
  .date()
  .transform((date) => dayjs.utc(date).format("DD/MM/YYYY"));

const rekapanRecordRowSchema = z
  .tuple([z.string().or(dateObjectSchema)])
  .rest(z.number().or(z.undefined()));

const rekapanRecordRowsSchema = z.array(rekapanRecordRowSchema);

type RekapanRecordRowSchema = z.infer<typeof rekapanRecordRowSchema>;

type RekapanRecordRowsSchema = z.infer<typeof rekapanRecordRowsSchema>;

const rekapanHeaderCellSchema = z.object({
  colIndex: z.number(),
});

type RekapanHeaderCellSchema = z.infer<typeof rekapanHeaderCellSchema>;

const rekapanHeaderRowSchema = z.record(z.string(), rekapanHeaderCellSchema);

type RekapanHeaderRowSchema = z.infer<typeof rekapanHeaderRowSchema>;

const rekapanHeaderListSchema = z
  .tuple([z.literal("Tanggal")])
  .rest(z.string());

type RekapanHeaderListSchema = z.infer<typeof rekapanHeaderListSchema>;

const getHeader = (
  worksheet: CleanedWorksheetSchema
): CleanedWorksheetRowSchema => {
  return worksheet[0]!;
};

const getRecordRows = (
  worksheet: CleanedWorksheetSchema
): Either<Error, CleanedWorksheetSchema> => {
  return worksheet.length === 3
    ? E.right([])
    : pipe(worksheet.slice(2, -1), logAndPipe, safeParseRekapanRecordRows);
};

/*
So what's the idea behind safeParseWorksheetObj?

I think it does the prevalidation essentially for the Arrays.

So first off, I think I want an array of objects. Even if it's inconssistent, we can find ways
to transform this later on to the gorup by object form. Right now, it's easiest to convert to
pure array form.

What does this mean for the zod validation?

So take the header and create the HeaderSchema.

Then with the rekapanHeaderListSchema essentially validate each 

*/

// I know the idea behind safeParseRekapanArrays is that it has the same structure
// As a rekapan. Which is that the first row is a header with first element as "Tangga;" literal
// And the rest are strings
// And for the records the first element is a date and the rest are numbers

const safeParseRekapanHeader = safeParse(rekapanHeaderListSchema);

const safeParseRekapanRecordRow = safeParse(rekapanRecordRowSchema);

const safeParseRekapanRecordRows = safeParse(rekapanRecordRowsSchema);

// const safeParseRekapanWorksheetObj = safeParse(rekapanWorksheetObjSchema)

const logAndPipe = <T>(arg: T): T => {
  return arg;
};

const getPrevBulanTotalSewaAlatAmount = (
  worksheet: CleanedWorksheetSchema
): Either<Error, CurrentBulanTotalSewaAlatAmountSchema> => {
  return pipe(
    worksheet,
    // logAndPipe,
    A.lookup(1),
    O.match(() => {
      throw new Error("Prev Bulan Total Sewa Alat Amount not found");
    }, identity),
    safeParsePrevBulanTotalSewaAlatAmount
  );
};

const getCurrentBulanTotalSewaAlatAmount = (
  worksheet: CleanedWorksheetSchema
): Either<Error, PrevBulanTotalSewaAlatAmountSchema> => {
  return pipe(
    worksheet,
    A.last,
    O.match(() => {
      throw new Error("Current Bulan Total Sewa Alat Amount not found");
    }, identity),
    safeParseCurrentBulanTotalSewaAlatAmount
  );
};
/*
What are the preconditions for which rows should be present in the worst case scenario?
Prev and Current Bulan Total Sewa Alat Amount is present
Will there always be at least 1 record? YES.
Will there always be a header? YES.
Is it possible to have an empty worksheet? NO.
So we KNOW the length must at least be 4 
1 for prevBulanTotalSewaAlatAmount, 1 for header, 1 for at least 1 record, 1 for currentBulanTotal
*/

const createHeaderRow = (
  header: RekapanHeaderListSchema
): RekapanHeaderRowSchema => {
  return pipe(
    header,
    A.mapWithIndex(
      (index, headerCell) => [headerCell, { colIndex: index }] as const
    ),
    fromEntries
  ) as RekapanHeaderRowSchema;
};

const annotateRekapanRowWithColIndex = (
  header: RekapanHeaderRowSchema,
  rekapanRow: RekapanRecordRowSchema
) => {
  return pipe(
    rekapanRow,
    A.mapWithIndex((index, cellValue) => [header[index]!, cellValue] as const)
  );
};

/*
  Worksheets must have at least 3 rows actually because sometimes you will have carry-over ones
  These have empty record rows

  so you end up with

  Tanggal -> Alat Names
  Prev Bulan Total Sewa Alat Amount 
  Current Bulan Total Sewa Alat Amount

*/

const convertWorksheetArraysToRekapanObj = (
  worksheet: CleanedWorksheetSchema
): Either<Error | ZodError, RekapanWorksheetObjSchema> => {
  if (worksheet.length < 3) {
    return E.left(new Error("Worksheet must have at least 3 rows"));
  }

  console.log({ worksheet });

  const headerList = pipe(
    getHeader(worksheet),
    // logPipe,
    safeParseRekapanHeader
  );

  const headerRow = pipe(headerList, E.map(createHeaderRow));

  const prevBulanTotalSewaAlatAmount = pipe(
    sequenceT(E.Monad)(getPrevBulanTotalSewaAlatAmount(worksheet), headerList),
    E.map(([prevBulanTotalSewaAlatAmount, headerList]) => {
      return A.zip(prevBulanTotalSewaAlatAmount)(headerList);
    }),
    E.map(fromEntries)
  );

  //

  const currentBulanTotalSewaAlatAmount = pipe(
    sequenceT(E.Monad)(
      getCurrentBulanTotalSewaAlatAmount(worksheet),
      headerList
    ),
    E.map(([currentBulanTotalSewaAlatAmount, headerList]) => {
      return A.zip(currentBulanTotalSewaAlatAmount)(headerList);
    }),
    E.map(fromEntries)
  );

  //

  const records = pipe(
    sequenceT(E.Monad)(getRecordRows(worksheet), headerList),
    E.map(([recordRows, headerList]) => {
      return pipe(
        recordRows,
        // Add a unit test here to make sure that the colIndex of headerRow
        // is correct per the index each item in recordRow is
        A.map((recordRow) => {
          return pipe(A.zip(recordRow)(headerList), fromEntries);
        })
      );
    })
  );

  console.log({ records });

  //

  const rekapanWorksheetObjSchema = pipe(
    headerList,
    E.map(createRekapanWorksheetObjSchema)
  );

  const safeParseRekapanWorksheetObj = pipe(
    rekapanWorksheetObjSchema,
    E.map(safeParse)
  );

  const obj = pipe(
    sequenceT(E.Monad)(
      records,
      headerRow,
      prevBulanTotalSewaAlatAmount,
      currentBulanTotalSewaAlatAmount
    ),
    E.map(
      ([
        records,
        header,
        prevBulanTotalSewaAlatAmount,
        currentBulanTotalSewaAlatAmount,
      ]) => {
        return {
          header,
          records,
          prevBulanTotalSewaAlatAmount,
          currentBulanTotalSewaAlatAmount,
        };
      }
    )
    // E.chainW((args) => args),
    // logAndReturn
  );

  console.log({ obj });

  return pipe(
    sequenceT(E.Monad)(obj, safeParseRekapanWorksheetObj),
    E.map(([obj, safeParseRekapanWorksheetObj]) => {
      return safeParseRekapanWorksheetObj(obj);
    }),
    E.flatten
  );
};

export type RekapanArrays = [
  RekapanHeaderListSchema,
  ...RekapanRecordRowSchema[],
];

// This is gonna be a bitch to do logic -wise.

// const getIndexToInsert = (
//   header: RekapanHeaderRowSchema,
//   columnName: string
// ) => {
//   return header[columnName]?.colIndex;
// };

// import { sort } from "radash";
// import { prettyPrint } from "../helpers/prettyPrint";

// const doConversion = (rekapanObj: RekapanWorksheetObjSchema): RekapanArrays => {
//   const {
//     header,
//     records,
//     prevBulanTotalSewaAlatAmount,
//     currentBulanTotalSewaAlatAmount,
//   } = rekapanObj;

//   let recordArr = [];

//   // string: string is for Tanggal: string,
//   // string: number is for alatName: number
//   for (const record of records) {
//     const sortedRecords = sort(records, (record) => record.colIndex);
//     for (const [columnName, cellValue] of Object.entries(record)) {
//       const indexToInsert = getIndexToInsert(header, columnName);
//       reco;
//     }
//   }
// };

const convertRekapanObjToRekapanArrays = (
  rekapanObj: RekapanWorksheetObjSchema
): RekapanArrays => {
  return pipe(rekapanObj, logAndPipe, (rekapanObj) => {
    const records = [
      rekapanObj.prevBulanTotalSewaAlatAmount,
      ...rekapanObj.records,
      rekapanObj.currentBulanTotalSewaAlatAmount,
    ];
    return [rekapanObj.header, ...records];
  });
};

// This will first take the ExcelArrays and then convert it to obj

// Afterwards we implement from ExcelObj to Rekapan Arrays

// So the workflow is Worksheet --> Obj --> Rekapan Arrays, this way also everything is more generic

export const convertExcelWorkbookToRekapanObj = (workbook: Workbook) => {
  const worksheets = workbook.worksheets;

  return pipe(
    worksheets,
    A.map((worksheet) => [worksheet.name, worksheet] as const),
    fromEntries,
    R.map((each) => {
      if (each.name === "ACSET ASYA SENTARIUM") {
        console.log(each.getSheetValues());
      }
      //
      // console.log(each.getSheetValues());
      return convertExcelWorksheetToArrays(each);
    }),
    // logAndPipe,
    R.sequence(E.Monad),
    E.chain(
      flow(
        R.map((worksheet) => {
          return convertWorksheetArraysToRekapanObj(worksheet);
        }),
        // logAndPipe,
        R.sequence(E.Monad)
      )
    )
  );
  // O.map(A.map(convertWorksheetArraysToRekapanObj))
};

type WrapInOption<T> = T extends any[]
  ? WrapInOption<T[number]>[]
  : O.Option<T>;

type OptionalCleanedWorksheetSchema = O.Option<string | number | Date>[][];

export const logPipe = <T>(arg: T): T => {
  return arg;
};

// const fillEmptyRowSpaces = (header: Header, records: CleanedWorksheetSchema): Either<Error, OptionalCleanedWorksheetSchema> => {

//   // The reason I did this instead of splitting into a getRecords function is because type system
//   // is a bitch, the A.dropLeft(1) in records already gets the records.
//   // If I did a separate getRecords function, I would have to make this return a worksheet,
//   // Where it contains the worksheet header + OptionalCleanedWorksheetSchema,
//   // I would have to play with infer to make sure typescript plays nicely
//   // Then in getRecords I would have to dropLeft and getRecords only

//   const headerLength = header.length

//   const cleanedRecords = pipe(records, A.map(A.map((cell) => O.of(cell))))

//   return pipe(
//     cleanedRecords,
//     A.map((recordRow) => {
//       const nulls = A.replicate(headerLength - recordRow.length, O.none)
//       return A.concat(recordRow)(nulls)
//     }),
//     E.right
//   )
// }

function isDefined<T>(val: T | undefined | null): val is T {
  return val !== undefined && val !== null;
}

export const cleanWorksheetArrays = (
  sheetValues: WorksheetSchema
): CleanedWorksheetSchema => {
  // For some reason undefined is not filtered out by the type system? Fix later
  return pipe(
    sheetValues,
    // There is undefined as the first row for some reason in exceljs
    A.dropLeft(1),
    (x) => {
      console.log({ x });
      return x;
    },
    // exceljs leaves the first element as undefined for some reason
    // Coerce undefined to empty array to standardize everything
    A.map((row) => (row === undefined ? [] : row)),

    A.map((row) => pipe(row!, A.dropLeft(1)))
  );
};

export const convertExcelWorksheetToArrays = (
  worksheet: Worksheet
): Either<Error, CleanedWorksheetSchema> => {
  return pipe(
    worksheet.getSheetValues(),
    (arg) => {
      console.log({ arg });

      return arg;
    },
    safeParseWorksheet,
    E.map(cleanWorksheetArrays)
  );
};

export const convertExcelWorksheetToRekapanArrays = (
  worksheet: Worksheet
): Either<Error | ZodError, RekapanWorksheetObjSchema> => {
  return pipe(
    worksheet,
    convertExcelWorksheetToArrays,
    E.chain(convertWorksheetArraysToRekapanObj)
    // E.map(convertRekapanObjToRekapanArrays)
  );
};

type CompanyName = string & {};

export type WorkbookRekapanArrays = Record<CompanyName, RekapanArrays>;

export const convertExcelWorkbookToRekapanArrays = (
  workbook: Workbook
): Either<Error, RekapanArrays[]> => {
  const sheetNames = pipe(
    workbook.worksheets,
    A.map(({ name }) => name)
  );

  const rekapanArrays = pipe(
    workbook.worksheets,
    A.map(convertExcelWorksheetToRekapanArrays),
    A.sequence(E.Monad)
  );

  return pipe(
    sequenceT(E.Monad)(rekapanArrays, E.of(sheetNames)),
    E.map(([rekapanArrays, sheetNames]) =>
      pipe(sheetNames, A.zip(rekapanArrays))
    ),
    E.map(R.fromEntries),
    E.map(objectValues)
  );
};

// A.map(convertExcelWorksheetToRekapanArrays),
// A.sequence(E.Monad)

export const convertExcelFileToArrays = (
  workbook: Workbook,
  worksheetName: string
): RekapanWorksheetObjSchema => {
  if (worksheetName === "") return [["Tanggal"]];
  const worksheet = workbook.getWorksheet(worksheetName);
  if (worksheet === undefined) throw new Error("Invalid Worksheet Name");
  const rowsEither = convertExcelWorksheetToRekapanArrays(worksheet);

  console.log({ rowsEither });

  // You need to add runtime validation here

  if (E.isLeft(rowsEither)) {
    throw rowsEither.left;
  }

  const rows = rowsEither.right;

  return rows;
};

// Per worksheet in the workbook
// You have an object of records
// The key should be the alat name
// The

type WorksheetName = string & {};

type AlatName = string & {};

type RekapanTotalSewaAmount = {
  [key: WorksheetName]: {
    [key: AlatName]: {
      total: number;
    };
  };
};

const useGetRekapanData = (
  worksheetName: string,
  date: Date,
  enabled: boolean
) => {
  const result = useGetRekeningExcelFile(date, enabled);

  console.log({ result });

  const cleanedData =
    result.data === undefined
      ? undefined
      : convertExcelFileToArrays(result.data, worksheetName);

  const finalResult = { ...result, data: cleanedData };

  return finalResult;
};

export default useGetRekapanData;
