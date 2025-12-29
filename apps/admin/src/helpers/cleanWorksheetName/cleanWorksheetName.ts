import { pipe } from "fp-ts/lib/function";

function truncateString(input: string): string {
  const EXCEL_WORKSHEET_NAME_MAX_CHARS = 31;
  if (input.length > EXCEL_WORKSHEET_NAME_MAX_CHARS) {
    return input.substring(0, 31);
  }
  return input;
}

function cleanWorksheetName(str: string) {
  // Define a regular expression to match the characters to be replaced
  // The 'g' flag ensures all instances are replaced
  const regex = /[\?:\/\\\[\]]/g;

  // Replace the matched characters with a whitespace
  let cleanedStr = str.replace(regex, " ");

  // Remove quotation marks from the beginning and end of the string
  cleanedStr = cleanedStr.replace(/"/g, "");
  cleanedStr = cleanedStr.replace(/'/g, "");

  return pipe(cleanedStr, truncateString);
}

export default cleanWorksheetName;
