import * as useToastContextModule from "#src/context/ToastContext";
import * as useAddHargaAlatModule from "#src/hooks/useAddHargaAlat";
import * as useGetHargaAlatModule from "#src/hooks/useGetHargaAlat/useGetHargaAlat";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { fromPartial } from "@total-typescript/shoehorn";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HargaAlat } from "./harga-alat";

describe("HargaAlat", () => {
  const mockProps = {
    selectedAlatName: "TestAlat",
    selectedCompanyName: "TestCompany",
  };

  const mockHargaData = [
    { name: "TestAlat", harga_harian: 100, harga_bulanan: 3000 },
  ];

  const mockShowToast = vi.fn();
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.spyOn(useGetHargaAlatModule, "default").mockReturnValue(
      fromPartial({
        data: mockHargaData,
        isLoading: false,
        error: null,
      })
    );

    vi.spyOn(useAddHargaAlatModule, "default").mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
    } as any);

    vi.spyOn(useToastContextModule, "useToastContext").mockReturnValue({
      showToast: mockShowToast,
    });
  });

  it("should populate inputs with initial server values", () => {
    render(<HargaAlat {...mockProps} />);
    expect(screen.getByLabelText("Harga Bulanan")).toHaveValue(3000);
    expect(screen.getByLabelText("Harga Harian")).toHaveValue(100);
  });

  it("should not show input button initially", () => {
    render(<HargaAlat {...mockProps} />);
    expect(
      screen.queryByRole("button", { name: /input/i })
    ).not.toBeInTheDocument();
  });

  it("should show input button when harga bulanan is changed", () => {
    render(<HargaAlat {...mockProps} />);
    const hargaBulananInput = screen.getByLabelText("Harga Bulanan");
    fireEvent.change(hargaBulananInput, { target: { value: "3500" } });
    expect(screen.getByRole("button", { name: /input/i })).toBeInTheDocument();
  });

  it("should show input button when harga harian is changed", () => {
    render(<HargaAlat {...mockProps} />);
    const hargaHarianInput = screen.getByLabelText("Harga Harian");
    fireEvent.change(hargaHarianInput, { target: { value: "150" } });
    expect(screen.getByRole("button", { name: /input/i })).toBeInTheDocument();
  });

  it("should not change harga harian when harga bulanan is changed", () => {
    render(<HargaAlat {...mockProps} />);
    const hargaBulananInput = screen.getByLabelText("Harga Bulanan");
    const hargaHarianInput = screen.getByLabelText("Harga Harian");
    fireEvent.change(hargaBulananInput, { target: { value: "3500" } });
    expect(hargaHarianInput).toHaveValue(100);
  });

  it("should not change harga bulanan when harga harian is changed", () => {
    render(<HargaAlat {...mockProps} />);
    const hargaBulananInput = screen.getByLabelText("Harga Bulanan");
    const hargaHarianInput = screen.getByLabelText("Harga Harian");
    fireEvent.change(hargaHarianInput, { target: { value: "150" } });
    expect(hargaBulananInput).toHaveValue(3000);
  });

  it("should reset harga bulanan value and hide button on blur if unchanged", async () => {
    render(<HargaAlat {...mockProps} />);
    const hargaBulananInput = screen.getByLabelText("Harga Bulanan");
    fireEvent.focus(hargaBulananInput);
    fireEvent.blur(hargaBulananInput);
    await waitFor(() => {
      expect(hargaBulananInput).toHaveValue(3000);
      expect(
        screen.queryByRole("button", { name: /input/i })
      ).not.toBeInTheDocument();
    });
  });

  it("should reset harga harian value and hide button on blur if unchanged", async () => {
    render(<HargaAlat {...mockProps} />);
    const hargaHarianInput = screen.getByLabelText("Harga Harian");
    fireEvent.focus(hargaHarianInput);
    fireEvent.blur(hargaHarianInput);
    await waitFor(() => {
      expect(hargaHarianInput).toHaveValue(100);
      expect(
        screen.queryByRole("button", { name: /input/i })
      ).not.toBeInTheDocument();
    });
  });

  it("should reset harga bulanan value and hide button on blur even if value is changed", async () => {
    render(<HargaAlat {...mockProps} />);
    const hargaBulananInput = screen.getByLabelText("Harga Bulanan");

    fireEvent.change(hargaBulananInput, { target: { value: "35000" } });
    fireEvent.blur(hargaBulananInput);
    await waitFor(() => {
      expect(hargaBulananInput).toHaveValue(3000);
      expect(
        screen.queryByRole("button", { name: /input/i })
      ).not.toBeInTheDocument();
    });
  });

  it("should reset harga harian value and hide button on blur even if value is changed", async () => {
    render(<HargaAlat {...mockProps} />);
    const hargaHarianInput = screen.getByLabelText("Harga Harian");

    fireEvent.change(hargaHarianInput, { target: { value: "300" } });
    fireEvent.blur(hargaHarianInput);
    await waitFor(() => {
      expect(hargaHarianInput).toHaveValue(100);
      expect(
        screen.queryByRole("button", { name: /input/i })
      ).not.toBeInTheDocument();
    });
  });
});
