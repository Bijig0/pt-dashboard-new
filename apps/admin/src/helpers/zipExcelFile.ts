import { saveAs } from "file-saver";
import * as A from "fp-ts/Array";
import { pipe } from "fp-ts/lib/function";
import JSZip from "jszip";
import { objectEntries } from "ts-extras";

type FileName = string & {};

export const zipFiles = (
  workbooks: Record<FileName, Buffer>,
  folderName: string
) => {
  const zip = new JSZip();

  const folder = zip.folder(folderName);

  if (folder === null) {
    throw new Error("Folder not found");
  }

  const addWorkbooksToFolder = (
    workbooks: Record<FileName, Buffer>,
    folder: JSZip
  ) => {
    return pipe(
      workbooks,
      objectEntries,
      A.map(([workbookName, workbookBuffer]) => {
        folder.file(`${workbookName}.xlsx`, workbookBuffer);
      })
    );
  };

  addWorkbooksToFolder(workbooks, folder);

  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, `${folderName}.zip`);
  });
};
