import { createBunExcelExpectedFilePath } from "./createBunExcelExpectedFilePath/createBunExcelExpectedFilePath";
import { createVitestExcelExpectedFilePath } from "./createVitestExcelExpectedFilePath/createVitestExcelExpectedFilePath";
import { getRuntimeEnvironment } from "./getRuntimeEnvironment/getRuntimeEnvironment";

type Args = {
  dirname: string;
  path: string;
};
export const createExcelExpectedFilePath = ({
  dirname,
  path,
}: Args): string => {
  const runTimeEnvironment = getRuntimeEnvironment();

  console.log({ runTimeEnvironment });

  const expectedFilePath =
    runTimeEnvironment === "bun"
      ? createBunExcelExpectedFilePath({
          dirname,
          path,
        })
      : createVitestExcelExpectedFilePath({
          dirname,
          path,
        });

  return expectedFilePath;
};
