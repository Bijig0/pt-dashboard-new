import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { vi } from "vitest";
import { DateForGrid, formatDate } from "./DateForGrid";

// should change worksheet data according to the change in selected date

describe("DateForGrid", () => {
  afterEach(() => {
    cleanup();
  });

  it("Should call setSelectedDate when date is changed", async () => {
    const dates = [new Date("2023-01-01 EDT"), new Date("2023-02-01 EDT")];
    const firstDate = dates[0]!;
    const secondDate = dates[1]!;

    const setSelectedDate = vi.fn();

    dayjs.extend(utc);
    const { getByTestId } = render(
      <DateForGrid
        dates={dates}
        selectedDate={firstDate}
        setSelectedDate={setSelectedDate}
      />
    );
    const dateChoices = getByTestId("date-select");
    expect(dateChoices).toHaveValue(formatDate(firstDate));

    const user = userEvent.setup();

    await user.selectOptions(dateChoices, formatDate(secondDate));

    expect(setSelectedDate).toHaveBeenCalledTimes(1);
    expect(setSelectedDate).toHaveBeenCalledWith(secondDate);
  });
});
