import { fn } from "@storybook/test";
import * as UseGetHargaAlatModule from "./useGetHargaAlat";
export * from "./useGetHargaAlat";

const useGetHargaAlat = fn(UseGetHargaAlatModule.default).mockName(
  "useGetHargaAlat"
);

export default useGetHargaAlat;
