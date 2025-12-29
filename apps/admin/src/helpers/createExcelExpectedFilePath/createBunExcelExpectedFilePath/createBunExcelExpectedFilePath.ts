type Args = {
  dirname: string;
  path: string;
};

export const createBunExcelExpectedFilePath = ({ dirname, path }: Args) =>
  `${dirname}${path}`;
