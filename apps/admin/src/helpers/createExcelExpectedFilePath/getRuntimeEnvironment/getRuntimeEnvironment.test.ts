import { getRuntimeEnvironment } from "./getRuntimeEnvironment";

describe("getRuntimeEnvironment", () => {
  it("should return vitest", () => {
    const runtimeEnvironment = getRuntimeEnvironment();
    expect(runtimeEnvironment).toEqual("vitest");
  });
});
