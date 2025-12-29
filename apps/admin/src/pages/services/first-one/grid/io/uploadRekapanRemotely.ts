import { Workbook } from "exceljs";
import yyyy_mm_dd_formatDate from "../../../../../helpers/yyyy_mm_dd_formatDate";
import { supabase } from "../../../../../supabase";

export const uploadRekapanRemotely = async (
  workbook: Workbook,
  selectedDate: Date
) => {
  const buffer = await workbook.xlsx.writeBuffer();
  const formattedSelectedDate = yyyy_mm_dd_formatDate(selectedDate);
  const { data, error } = await supabase.storage
    .from("pt-backend")
    .upload(`rekapans/${formattedSelectedDate}.xlsx`, buffer, {
      contentType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      upsert: true,
    });
  data;
  error;
};
