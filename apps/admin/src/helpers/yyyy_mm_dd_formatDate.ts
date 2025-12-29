const yyyy_mm_dd_formatDate = (date: Date): string => {
  let formattedDate = date.toISOString().split("T")[0];
  if (formattedDate === undefined) throw new Error("Date is undefined");
  return formattedDate;
};

export default yyyy_mm_dd_formatDate;
