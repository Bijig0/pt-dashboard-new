import { StorageError } from "@supabase/storage-js";
import { PostgrestError, PostgrestSingleResponse } from "@supabase/supabase-js";
import ExcelJS, { Workbook } from "exceljs";
import * as E from "fp-ts/Either";
import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/lib/function";
import { supabase } from "../../supabase";
import yyyy_mm_dd_formatDate from "../yyyy_mm_dd_formatDate";

type SupabaseResultTypes = "Storage" | "SQL";

type SupabaseResult<T extends SupabaseResultTypes> = {
  result:
    | {
        data: T extends "Storage" ? Blob : null;
        error: null;
      }
    | {
        data: null;
        error: T extends "Storage" ? StorageError : PostgrestError;
      };
};

// Unfinished

const supabaseSampleFn = async () =>
  await supabase
    .from("record")
    .select("masuk,keluar,company_name,alat_name,tanggal");

type x = typeof supabaseSampleFn;

// const supabaseFnToTE = <
//   T extends SupabaseResult<QueryType>,
//   QueryType extends SupabaseResultTypes,
//   SupabaseResponse extends Record<PropertyKey, any>,
// >(
//   fn: () => Promise<PostgrestSingleResponse<SupabaseResponse>>
// ): TE.TaskEither<Error, E.Either<StorageError, T["result"]["data"]>> => {
//   return pipe(
//     TE.tryCatch(fn, (error) => error as Error),
//     TE.map((result) =>
//       result.data ? E.right(result.data) : E.left(result.error)
//     )
//   );
// };

function readFile(
  blob: Blob
): TE.TaskEither<ProgressEvent<FileReader>, ArrayBuffer> {
  return TE.tryCatch(
    () =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(blob);
        reader.onload = () => {
          resolve(reader.result as ArrayBuffer);
        };
        reader.onerror = (error) => {
          reject(error);
        };
      }),
    (error) => error as ProgressEvent<FileReader>
  );
}

const convertIntoExcelFile = (
  excelBlob: Blob
): TE.TaskEither<Error | ProgressEvent<FileReader>, Workbook> => {
  return pipe(
    readFile(excelBlob),
    TE.chainW((buffer) => {
      const workbook = new ExcelJS.Workbook();
      return TE.tryCatch(
        () => workbook.xlsx.load(buffer),
        (error) => error as Error
      );
    })
  );
};

const requestExcelRekapanFile = (
  path: string
): TE.TaskEither<Error | StorageError, Blob> => {
  return pipe(
    TE.tryCatch(
      () => supabase.storage.from("pt-backend").download(path),
      (error) => error as Error
    ),
    TE.chain((result) =>
      result.data ? TE.right(result.data) : TE.left(result.error)
    )
  );
};

const formatPath = (dateString: string) => `rekapans/${dateString}.xlsx`;

export const getRekapanData = async (date: Date): Promise<Workbook> => {
  // Excel Rekapan files are in yyyy_mm_dd format
  const path = pipe(date, yyyy_mm_dd_formatDate, formatPath);

  const getExcelFile = pipe(
    requestExcelRekapanFile(path),
    TE.chainW((blob) => convertIntoExcelFile(blob)),
    TE.getOrElse((error) => {
      if (error instanceof StorageError) {
        return T.of(new ExcelJS.Workbook());
      }
      throw error;
    })
  );

  const excelFile = await getExcelFile();

  return excelFile;
};
