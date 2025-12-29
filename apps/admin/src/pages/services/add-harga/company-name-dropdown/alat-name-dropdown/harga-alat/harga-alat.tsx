import { useToastContext } from "#src/context/ToastContext.js";
import useAddHargaAlat from "#src/hooks/useAddHargaAlat.js";
import useCreateAlat from "#src/hooks/useCreateAlat.js";
import useGetHargaAlat from "#src/hooks/useGetHargaAlat/useGetHargaAlat.js";
import { queryClient } from "#src/react-query.js";
import { HargaAlatSchema } from "#src/types/schemas.js";
import { Button, Label, TextInput } from "flowbite-react";
import React, { ReactNode, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CamelKeys, camelKeys } from "string-ts";
import { validateInitialStokValue } from "./validateInitialHargas/validateInitialHargas";

type HargaAlatInputs = {
  hargaBulanan: number | null;
  hargaHarian: number | null;
};

type Props = {
  selectedAlatName: string;
  selectedCompanyName: string;
  mode: 'view' | 'create';
  alatNames: string[];
  setHasUnsavedChanges: (value: boolean) => void;
  onCreateSuccess: (newAlatName: string) => void;
};

export const HargaAlat = (props: Props) => {
  const { selectedAlatName, selectedCompanyName, mode, alatNames, setHasUnsavedChanges, onCreateSuccess } = props;

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const [toConfirm, setToConfirm] = useState(false);

  console.log({ selectedAlatName, selectedCompanyName, mode });

  // Duplicate validation for create mode
  const isDuplicateName = mode === 'create' &&
    alatNames.some(name => name.toLowerCase() === selectedAlatName.toLowerCase());

  const {
    data: harga,
    isLoading,
    error,
  } = useGetHargaAlat(selectedCompanyName, selectedAlatName, {
    enabled: mode === 'view' && !!selectedAlatName,
  });

  console.log({ harga });

  let dataList: HargaAlatSchema | undefined;
  let dataSingle: CamelKeys<HargaAlatSchema[number]> | undefined;

  if (isLoading) {
    dataList = undefined;
  } else if (harga !== undefined) {
    dataList = harga;
    if (dataList !== undefined) {
      validateInitialStokValue({ harga: dataList, selectedAlatName });
      dataSingle = camelKeys(dataList[0]!);
    }
  }

  const { showToast } = useToastContext();

  const mutation = useAddHargaAlat({
    onSuccess: async () => {
      showToast("success", "Harga Alat successfully changed");
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ["harga"],
      });
    },
  });

  const createMutation = useCreateAlat({
    onSuccess: () => {
      showToast("success", "Alat created successfully");
      queryClient.invalidateQueries({ queryKey: ["proyekAlats", selectedCompanyName] });
      onCreateSuccess(selectedAlatName);
    },
    onError: (error) => {
      showToast("error", `Failed to create alat: ${error.message}`);
    },
  });

  const { isPending, variables, isError: isAddInitialStokError } = mutation;

  const serverInitialStokValues = variables || dataSingle;

  console.log({ serverInitialStokValues });

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<HargaAlatInputs>({
    values: serverInitialStokValues,
  });

  const watchInitialHargaBulanan = watch("hargaBulanan");
  const watchInitialHargaHarian = watch("hargaHarian");

  // Dirty state tracking
  useEffect(() => {
    if (mode === 'create') {
      const hasData = selectedAlatName || watchInitialHargaBulanan || watchInitialHargaHarian;
      setHasUnsavedChanges(Boolean(hasData));
    } else {
      const showSubmitButton = Boolean(
        (watchInitialHargaBulanan &&
          watchInitialHargaBulanan !== serverInitialStokValues?.hargaBulanan) ||
          (watchInitialHargaHarian &&
            watchInitialHargaHarian !== serverInitialStokValues?.hargaHarian)
      );
      setHasUnsavedChanges(showSubmitButton);
    }
  }, [mode, selectedAlatName, watchInitialHargaBulanan, watchInitialHargaHarian, serverInitialStokValues, setHasUnsavedChanges]);

  // Only validate in view mode
  if (mode === 'view') {
    if (!harga) {
      return null;
    }

    if (harga.length !== 1)
      throw new Error(
        `More than one record found when searching for ${selectedAlatName}`
      );
  }

  const onSubmit: SubmitHandler<HargaAlatInputs> = async (data) => {
    if (data.hargaBulanan === null)
      throw Error("Cannot submit an empty hargaBulanan");
    if (data.hargaHarian === null)
      throw Error("Cannot submit an empty hargaHarian");

    // Duplicate validation for create mode
    if (mode === 'create' && isDuplicateName) {
      showToast("error", `Alat "${selectedAlatName}" already exists`);
      return;
    }

    if (!toConfirm) {
      setToConfirm(true);
      return;
    }

    setToConfirm(false);

    if (mode === 'create') {
      createMutation.mutate({
        hargaBulanan: data.hargaBulanan,
        hargaHarian: data.hargaHarian,
        alatName: selectedAlatName.trim(),
        companyName: selectedCompanyName,
      });
    } else {
      mutation.mutate({
        hargaBulanan: data.hargaBulanan,
        hargaHarian: data.hargaHarian,
        alatName: selectedAlatName,
        companyName: selectedCompanyName,
      });
    }

    if (error) throw error;

    reset();
    inputRef.current?.blur();
  };

  const createErrorText = (): ReactNode => {
    if (isDuplicateName) {
      return (
        <span className="font-medium text-red-600">
          Alat with this name already exists
        </span>
      );
    }

    if (mode === 'create' && !selectedAlatName.trim()) {
      return (
        <span className="font-medium text-red-600">
          Alat name is required
        </span>
      );
    }

    if (isAddInitialStokError) {
      return (
        <span className="font-medium">
          Error adding new row, please try again
        </span>
      );
    }

    if (errors.hargaBulanan) {
      return <span className="font-medium">{errors.hargaBulanan.message}</span>;
    }

    if (errors.hargaHarian) {
      return <span className="font-medium">{errors.hargaHarian.message}</span>;
    }

    return null;
  };

  const showSubmitButton = Boolean(
    mode === 'create' || // Always show in create mode
    (watchInitialHargaBulanan &&
      watchInitialHargaBulanan !== serverInitialStokValues?.hargaBulanan) ||
      (watchInitialHargaHarian &&
        watchInitialHargaHarian !== serverInitialStokValues?.hargaHarian)
  );

  console.log({ showSubmitButton });

  const { ref: rhfRefHargaBulanan, ...hargaBulananRest } = register(
    "hargaBulanan",
    {
      required: true,
    }
  );
  const { ref: rhfRefHargaHarian, ...hargaHarianRest } = register(
    "hargaHarian",
    {
      required: true,
    }
  );

  return (
    <form
      className="gap-y-2 flex flex-col"
      onBlur={() => {
        if (!toConfirm) {
          reset();
          return;
        }

        if (toConfirm) {
          reset();
          setToConfirm((prevToConfirm) => !prevToConfirm);
          return;
        }
      }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Label
        htmlFor="hargaBulanan"
        className="text-sm font-normal text-gray-600 dark:text-gray-400"
      >
        Harga Bulanan
      </Label>
      <TextInput
        {...hargaBulananRest}
        ref={(e) => {
          rhfRefHargaBulanan(e);
          inputRef.current = e;
        }}
        type="number"
        step={"any"}
        id="hargaBulanan"
        name="hargaBulanan"
        className={isPending ? "opacity-50" : undefined}
        placeholder="Enter harga bulanan"
        color={errors.hargaBulanan && "failure"}
        helperText={createErrorText()}
      />
      <Label
        htmlFor="hargaHarian"
        className="text-sm font-normal text-gray-600 dark:text-gray-400"
      >
        Harga Harian
      </Label>
      <TextInput
        {...hargaHarianRest}
        ref={(e) => {
          rhfRefHargaHarian(e);
          inputRef.current = e;
        }}
        type="number"
        step={"any"}
        id="hargaHarian"
        name="hargaHarian"
        className={isPending ? "opacity-50" : undefined}
        placeholder="Enter harga harian"
        color={errors.hargaHarian && "failure"}
        helperText={createErrorText()}
      />
      <div></div>
      {showSubmitButton && (
        <Button
          onMouseDown={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
            e.preventDefault()
          }
          type="submit"
          disabled={mode === 'create' && (isDuplicateName || !selectedAlatName.trim())}
        >
          {mode === 'create'
            ? (!toConfirm ? "Create Alat" : "Confirm Create")
            : (!toConfirm ? "Input" : "Confirm")
          }
        </Button>
      )}
    </form>
  );
};
