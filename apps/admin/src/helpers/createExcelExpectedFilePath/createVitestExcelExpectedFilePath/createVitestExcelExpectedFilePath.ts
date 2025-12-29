type Args = {
  dirname: string;
  path: string;
};
export const createVitestExcelExpectedFilePath = ({
  dirname,
  path,
}: Args): string => {
  const inFilePath = `${dirname}${path}`;
  const withoutInitialSlash = inFilePath.slice(1);
  return withoutInitialSlash;
};
