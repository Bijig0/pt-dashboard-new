type Args = {
  companyName: string;
  allowedCompanyNames: string[];
};

export const checkIsCompanyNameValid = ({
  companyName,
  allowedCompanyNames,
}: Args): boolean => {
  const isValid = allowedCompanyNames.includes(companyName);
  return isValid;
};
