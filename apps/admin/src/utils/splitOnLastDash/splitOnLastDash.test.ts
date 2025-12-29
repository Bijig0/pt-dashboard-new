import { splitOnLastDash } from "./splitOnLastDash";

describe("splitOnLastDash", () => {
  it("should split a string on the last dash", () => {
    const result = splitOnLastDash("hello-world-test");
    expect(result).toEqual(["hello-world", "test"]);
  });

  it("should split retur string", () => {
    const result = splitOnLastDash("12/12/2024-Retur");
    expect(result).toEqual(["12/12/2024", "Retur"]);
  });

  it("should split sewa string", () => {
    const result = splitOnLastDash("12/12/2024-Sewa");
    expect(result).toEqual(["12/12/2024", "Sewa"]);
  });
});
