import { stringify } from "flatted";

export const prettyPrint = (data: unknown) => {
  console.log(stringify(data));
};
