import { ZodError } from "zod";
import {
  COMPANY_NAME_NOT_STRING_ERROR_MESSAGE,
  StokAlatSchema,
} from "./stok-alat-schema";

describe("StokAlatSchema", () => {
  it("should validate correct data", () => {
    const validData = [new Date(), "Company A", 10, null];
    expect(() => StokAlatSchema.parse(validData)).not.toThrow();
  });

  it("should prune extra elements", () => {
    const data = [new Date(), "Company A", 10, null, "extra", "data"];
    const result = StokAlatSchema.parse(data);
    expect(result).toEqual({
      date: expect.any(Date),
      company: "Company A",
      masuk: 10,
      keluar: null,
    });
  });

  it("should throw error for insufficient elements", () => {
    const invalidData = [new Date(), "Company A", 10];
    expect(() => StokAlatSchema.parse(invalidData)).toThrow(ZodError);
  });

  it("should throw error when both masuk and keluar are numbers", () => {
    const invalidData = [new Date(), "Company B", 20, 30];
    expect(() => StokAlatSchema.parse(invalidData)).toThrow(ZodError);
  });

  it("should throw error when both masuk and keluar are null", () => {
    const invalidData = [new Date(), "Company C", null, null];
    expect(() => StokAlatSchema.parse(invalidData)).toThrow(ZodError);
  });

  it("should accept keluar as a number and masuk as null", () => {
    const validData = [new Date(), "Company D", null, 40];
    expect(() => StokAlatSchema.parse(validData)).not.toThrow();
  });

  it("should throw error when date is invalid", () => {
    const invalidData = ["not a date", "Company E", 50, null];
    expect(() => StokAlatSchema.parse(invalidData)).toThrow(ZodError);
  });

  it("should throw error when company name is not a string", () => {
    const invalidData = [new Date(), 123, 60, null];
    expect(() => StokAlatSchema.parse(invalidData)).toThrow(ZodError);
  });

  it("should throw error when masuk is not a number or null", () => {
    const invalidData = [new Date(), "Company F", "not a number", null];
    expect(() => StokAlatSchema.parse(invalidData)).toThrow(ZodError);
  });

  it("should throw error when keluar is not a number or null", () => {
    const invalidData = [new Date(), "Company G", null, "not a number"];
    expect(() => StokAlatSchema.parse(invalidData)).toThrow(ZodError);
  });

  it("should transform the data into the correct shape", () => {
    const validData = [new Date(), "Company H", 70, null];
    const result = StokAlatSchema.parse(validData);
    expect(result).toEqual({
      date: expect.any(Date),
      company: "Company H",
      masuk: 70,
      keluar: null,
    });
  });

  it("should throw an error if the company name is not a string", () => {
    const invalidData = [new Date(), 123, 60, null];
    expect(() => StokAlatSchema.parse(invalidData)).toThrow(
      COMPANY_NAME_NOT_STRING_ERROR_MESSAGE
    );
  });
});
