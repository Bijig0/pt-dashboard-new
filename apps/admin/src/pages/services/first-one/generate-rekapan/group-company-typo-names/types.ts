export type CorrectCompanyName = string & {};
export type PossibleCorrectCompanyNameFromPrevMonthStokAlat = string & {};
export type Row = {
  typoCompanyNames: string[];
  correctCompanyName: CorrectCompanyName;
  possibleCorrectCompanyNameFromPrevMonthStokAlat:
    | PossibleCorrectCompanyNameFromPrevMonthStokAlat
    | undefined;
  split?: boolean;
  moved?: Moved[];
};
export type Moved = {
  typoCompanyNameMoved: string;
  from: CorrectCompanyName;
  to: CorrectCompanyName;
};

export type ClusteredCompanyNames = Record<CorrectCompanyName, Row> & {};
