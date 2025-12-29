import {
  COMPANY_NAME_NOT_STRING_ERROR_MESSAGE,
  StokAlatSchema,
} from "../../stok-alat-schema/stok-alat-schema";
import { checkIsCompanyNameValid } from "./check-is-company-name-valid/check-is-company-name-valid";

type Args = {
  rows: any[];
  allowedCompanyNames: string[];
};

type Return = {
  errors: Error[];
};

const createCompanyNameErrorMessage = (companyName: string) =>
  `Company name ${companyName} is not allowed`;

export const validateStokAlatRow = ({
  rows,
  allowedCompanyNames,
}: Args): Return => {
  const result = StokAlatSchema.safeParse(rows);

  if (result.success) return { errors: [] };

  const errorMessage = result.error.errors.map((e) => e.message).join(", ");

  const parseError = new Error(errorMessage);

  if (parseError.message === COMPANY_NAME_NOT_STRING_ERROR_MESSAGE) {
    return { errors: [parseError] };
  }

  const companyName = rows[1];

  const isCompanyNameValid = checkIsCompanyNameValid({
    companyName,
    allowedCompanyNames,
  });

  const companyNameErrorMessage = createCompanyNameErrorMessage(companyName);

  const companyNameError = isCompanyNameValid
    ? undefined
    : new Error(companyNameErrorMessage);

  const errors = [parseError, companyNameError].filter(Boolean);

  return { errors };
};
