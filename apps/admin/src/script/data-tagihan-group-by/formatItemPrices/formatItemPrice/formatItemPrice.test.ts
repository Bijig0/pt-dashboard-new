import { formatItemPrice } from "./formatItemPrice";

describe("formatItemPrice", () => {
  it("should format whole numbers without decimals", () => {
    expect(formatItemPrice(1000)).toBe("1,000");
    expect(formatItemPrice(1234567)).toBe("1,234,567");
    expect(formatItemPrice(42)).toBe("42");
  });

  it("should format decimal numbers with two decimal places", () => {
    expect(formatItemPrice(1234.56)).toBe("1,234.56");
    expect(formatItemPrice(0.99)).toBe("0.99");
    expect(formatItemPrice(1000.01)).toBe("1,000.01");
  });

  it("should round to two decimal places", () => {
    expect(formatItemPrice(1234.567)).toBe("1,234.57");
    expect(formatItemPrice(42.004)).toBe("42.00");
  });

  it("should handle zero correctly", () => {
    expect(formatItemPrice(0)).toBe("0");
  });

  it("should handle negative numbers", () => {
    expect(formatItemPrice(-1000)).toBe("-1,000");
    expect(formatItemPrice(-1234.56)).toBe("-1,234.56");
  });
});
