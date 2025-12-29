import { composeStories } from "@storybook/react";
import { screen, waitFor } from "@testing-library/react";
import * as stories from "./synchronize-company-names-manager.stories"; // 👈 Our stories imported here.

const {
  AllExcelCompanyNamesMissing,
  AllPresentCompanyNames,
  SomeExcelCompanyNamesNotInDatabase,
} = composeStories(stories);

describe("SynchronizeCompanyNamesManager", () => {
  it("should open modal when not all excel company names are in database", async () => {
    AllExcelCompanyNamesMissing.run();

    await waitFor(() => {
      const modal = screen.getByTestId("modal-overlay");
      expect(modal).toBeInTheDocument();
    });

    const companyA = screen.getByText("Company A");
    const companyB = screen.getByText("Company B");
    const companyC = screen.getByText("Company C");

    expect(companyA).toBeInTheDocument();
    expect(companyB).toBeInTheDocument();
    expect(companyC).toBeInTheDocument();
  });

  it("should not open modal when all excel company names are in database", async () => {
    AllPresentCompanyNames.run();

    await waitFor(() => {
      const modal = screen.queryByTestId("modal-overlay");
      expect(modal).not.toBeInTheDocument();
    });
  });

  it(`should upload only all the excel company names 
  not in the database (not just the initial all excel company names)`, async () => {
    SomeExcelCompanyNamesNotInDatabase.run();

    await waitFor(() => {
      const modal = screen.getByTestId("modal-overlay");
      expect(modal).toBeInTheDocument();
    });

    const companyA = screen.queryByText("Company A");
    const companyB = screen.queryByText("Company B");

    expect(companyA).not.toBeInTheDocument();
    expect(companyB).not.toBeInTheDocument();

    const companyC = screen.getByText("Company C");

    expect(companyC).toBeInTheDocument();
  });
});
