import { composeStories } from "@storybook/react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { SYNCHRONIZE_SUCCESS_TOAST_TEXT } from "./synchronize-company-names-modal";
import * as stories from "./synchronize-company-names-modal.stories"; // 👈 Our stories imported here.
import * as SynchronizeCompanyNamesModule from "./useSynchronizeCompanyNames/synchronizeCompanyNames/synchronizeCompanyNames";

const { Open } = composeStories(stories);

const SYNCHRONIZE_BUTTON_TEXT = "Synchronize";

describe("synchronize-company-names-modal", () => {
  it("shows a success toast on success and closes the modal", async () => {
    vi.spyOn(
      SynchronizeCompanyNamesModule,
      "synchronizeCompanyNames"
    ).mockImplementation(async () => {});

    Open.run();

    const synchronizeCompanyNamesButton = await screen.findByText(
      SYNCHRONIZE_BUTTON_TEXT
    );

    userEvent.click(synchronizeCompanyNamesButton);

    const successToast = await screen.findByText(
      SYNCHRONIZE_SUCCESS_TOAST_TEXT
    );

    expect(successToast).toBeInTheDocument();

    // expect a toast to show
  });

  it("shows an error toast on error ", async () => {
    const SYNCHRONIZATOIN_ERROR_TOAST_TEXT = "Error";
    vi.spyOn(
      SynchronizeCompanyNamesModule,
      "synchronizeCompanyNames"
    ).mockImplementation(async () => {
      throw new Error(SYNCHRONIZATOIN_ERROR_TOAST_TEXT);
    });

    Open.run();

    const synchronizeCompanyNamesButton = await screen.findByText(
      SYNCHRONIZE_BUTTON_TEXT
    );

    userEvent.click(synchronizeCompanyNamesButton);

    const errorToast = await screen.findByText(
      SYNCHRONIZATOIN_ERROR_TOAST_TEXT
    );

    expect(errorToast).toBeInTheDocument();

    // expect a toast to show
  });
});
