import { fn } from "@storybook/test";
import * as GetHarianHargaSewaModule from "./getHarianHargaSewa";
export * from "./getHarianHargaSewa";

export const getHarianHargaSewa = fn(
  GetHarianHargaSewaModule.getHarianHargaSewa
).mockName("getHarianHargaSewa");
