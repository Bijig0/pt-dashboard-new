import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import * as O from "fp-ts/Option";
import * as R from "fp-ts/Record";
import { pipe } from "fp-ts/lib/function";
import { merge } from "ts-deepmerge";
import { RekapanWorkbookObj } from "../../../../hooks/useGetRekapanData";
import { AlatName, CompanyName, RekapanWorkbookBody } from "../../types";
import { createWorkbookCurrentBulanTotalSewaAlatAmountObj } from "./createWorkbookCurrentBulanTotalSewaAlatAmountObj/createWorkbookCurrentBulanTotalSewaAlatAmountObj";
import { createWorksheetsAlatColIndexObj } from "./createWorkbookCurrentBulanTotalSewaAlatAmountObj/createWorksheetsAlatColIndexObj/createWorksheetsAlatColIndexObj";
import { createWorksheetsAlatNamesObj } from "./createWorksheetsAlatNamesObj/createWorksheetsAlatNamesObj";
import { createWorksheetsPrevBulanTotalSewaAlatAmountObj } from "./createWorksheetsPrevBulanTotalSewaAlatAmountObj/createWorksheetsPrevBulanTotalSewaAlatAmountObj";
import { createWorksheetsTanggalObj } from "./createWorksheetsTanggalObj/createWorksheetsTanggalObj";
import { listWorksheetsAlatNames } from "./listWorksheetsAlatNames/listWorksheetsAlatNames";

dayjs.extend(utc);

type WorksheetAlatHeaderObj<Obj extends Record<PropertyKey, any>> = Record<
  AlatName,
  Obj
> & {};

type WorksheetsAlatHeaderObj<Obj extends Record<PropertyKey, any>> = {
  [x: CompanyName]: WorksheetAlatHeaderObj<Obj> & {};
} & {};

export type RekapanWorkbookHeader = {
  [x: CompanyName]: {
    header: {
      [x: AlatName]: {
        rekapanMonth: number;
        currentBulanTotalSewaAlatAmount: number;
        prevBulanTotalSewaAlatAmount: number;
        colIndex: number;
        alatName: AlatName;
      };
    };
  };
} & {};

/*
When trying to get a current month rekapan's in the prev month rekapan.

what happens if the current month has a new one? Well then the prev month for that sbould be 0

This is the unhandled case

This workbook is the prevMonthRekapan workbook, so

The one I added at the start was currentMonthRekapan += prevMonthRekapan

But i haven't actually changed the prevMonthRekapan

Also if currentBulanTotalSewaAlatAmount[alatName] is not present,

I am doing an Option because say I have a new alat, and it's not in the prevMonthRekapan

It should not error, it should just return 0


*/

export const logAndPipe = <T>(arg: T): T => {
  console.log(arg);
  return arg;
};

type CreateAlatHeaderArgs = {
  currentMonthWorksheetsTanggalObj: WorksheetsAlatHeaderObj<{
    rekapanMonth: number;
  }>;
  currentBulanTotalSewaAlatAmountObj: WorksheetsAlatHeaderObj<{
    currentBulanTotalSewaAlatAmount: number;
  }>;
  prevBulanTotalSewaAlatAmountObj: WorksheetsAlatHeaderObj<{
    prevBulanTotalSewaAlatAmount: number;
  }>;
  colIndexObj: WorksheetsAlatHeaderObj<{ colIndex: number }>;
  alatNameObj: WorksheetsAlatHeaderObj<{ alatName: AlatName }>;
};

const createRekapanHeader = (
  args: CreateAlatHeaderArgs
): RekapanWorkbookHeader => {
  const {
    currentMonthWorksheetsTanggalObj,
    currentBulanTotalSewaAlatAmountObj,
    prevBulanTotalSewaAlatAmountObj,
    colIndexObj,
    alatNameObj,
  } = args;

  return pipe(
    merge(
      currentMonthWorksheetsTanggalObj,
      currentBulanTotalSewaAlatAmountObj,
      prevBulanTotalSewaAlatAmountObj,
      colIndexObj,
      alatNameObj
    ),
    R.map((header) => {
      return { header };
    })
  );
};

/*

So reasons for the empty worksheets when creating a should be fulfilled rekapan

What I've done so far.

in createRekapanJS I have carried over the empty company names from the previous months
but they have no records

What I want in the end, for every prev month company with carried over rows,

List all the previous alatNames and all the previous currentBulanSewaAlatAmounts for each

Is there a way to do it implicitly, yes

But, if statements are nicer here 

1. Problem: There are empty alats for the carry-over empty rows.
1. Solution: 
    Part 1: Add the prevMonthRekapan alts to listWorksheetsAlatNames
    Part 2: Make it so that for every company name where

Is there a way to name an Option? Because we want a reason for it to be an Option and it shouldn't be an 
either
  


Cuz it's taking all the alat Names from the current month and all the
Worksheet names from the current month so if
the current month does not contain that worksheet name/ does not contain that alat name
Then it gets completely ignored

Ok but the thing is currentMonthRekapanWorkbookBody should actually now contain
all the ones
*/

export const addRekapanHeader = (
  currentMonthRekapanWorkbookBody: RekapanWorkbookBody,
  prevMonthRekapan: O.Option<RekapanWorkbookObj>,
  rekapanMonth?: number
) => {
  const currentMonthWorksheetAlatNames = listWorksheetsAlatNames(
    currentMonthRekapanWorkbookBody,
    pipe(
      prevMonthRekapan,
      O.getOrElse(() => {
        return {};
      })
    )
  );

  const currentMonthWorksheetsTanggalObj = createWorksheetsTanggalObj(
    currentMonthWorksheetAlatNames,
    currentMonthRekapanWorkbookBody,
    rekapanMonth
  );

  // console.log({ currentMonthWorksheetsTanggalObj });

  const currentMonthWorksheetsAlatNamesObj = createWorksheetsAlatNamesObj(
    currentMonthWorksheetAlatNames
  );

  const currentMonthWorksheetsAlatColIndexObj = createWorksheetsAlatColIndexObj(
    currentMonthWorksheetAlatNames
  );

  const currentMonthWorksheetsPrevBulanTotalSewaAlatAmountObj =
    createWorksheetsPrevBulanTotalSewaAlatAmountObj(
      currentMonthWorksheetAlatNames,
      prevMonthRekapan
    );

  // console.log({ currentMonthWorksheetsPrevBulanTotalSewaAlatAmountObj });

  const currentMonthWorksheetsCurrentBulanTotalSewaAlatAmountObj =
    createWorkbookCurrentBulanTotalSewaAlatAmountObj(
      currentMonthRekapanWorkbookBody,
      currentMonthWorksheetsPrevBulanTotalSewaAlatAmountObj
    );

  // console.log({ currentMonthWorksheetsCurrentBulanTotalSewaAlatAmountObj });

  const rekapanWorkbookHeader = createRekapanHeader({
    currentMonthWorksheetsTanggalObj,
    currentBulanTotalSewaAlatAmountObj:
      currentMonthWorksheetsCurrentBulanTotalSewaAlatAmountObj,
    prevBulanTotalSewaAlatAmountObj:
      currentMonthWorksheetsPrevBulanTotalSewaAlatAmountObj,
    colIndexObj: currentMonthWorksheetsAlatColIndexObj,
    alatNameObj: currentMonthWorksheetsAlatNamesObj,
  });

  // console.log({ rekapanWorkbookHeader });

  // console.log({ currentMonthRekapanWorkbookBody });

  const added = merge(rekapanWorkbookHeader, currentMonthRekapanWorkbookBody);

  return added;
};

// @ts-ignore
if (import.meta?.main) {
  const currentMonthRekapanWorkbookBody = {
    "Company A": {
      records: [
        {
          tanggal: "25/12/2023",
          masuk: -123,
          keluar: 0,
          companyName: "Company A",
          alatName: "Alat1",
          stokDifference: -123,
        },
      ],
    },
    "Company B": {
      records: [
        {
          tanggal: "01/12/2023",
          masuk: -789,
          keluar: 0,
          companyName: "Company B",
          alatName: "Alat2",
          stokDifference: -789,
        },
      ],
    },
  } satisfies RekapanWorkbookBody;

  const prevMonthRekapan = {
    "Company A": {
      currentBulanTotalSewaAlatAmount: {
        Alat1: 1000,
        Alat2: 2000,
      },
      prevBulanTotalSewaAlatAmount: {},
      header: {},
      records: [],
    },
    "Company B": {
      currentBulanTotalSewaAlatAmount: {
        Alat3: 3000,
      },
      prevBulanTotalSewaAlatAmount: {},
      header: {},
      records: [],
    },
  } satisfies RekapanWorkbookObj;

  const result = addRekapanHeader(currentMonthRekapanWorkbookBody, O.some(prevMonthRekapan));

  console.log(JSON.stringify(result, null, 2));
}
