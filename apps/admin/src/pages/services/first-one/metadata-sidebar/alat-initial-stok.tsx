import { Button, TextInput } from "flowbite-react";
import React, { ReactNode, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CamelKeys, camelKeys } from "string-ts";
import { useToastContext } from "../../../../context/ToastContext";
import useAddInitialStok from "../../../../hooks/useAddInitialStok";
import useGetInitialStok from "../../../../hooks/useGetInitialStok";
import { initialStokKeys, queryClient } from "../../../../react-query";
import { InitialStokSchema } from "../../../../types/schemas";

type AlatInitialStokInputs = {
  initialStok: number | null;
};

type AlatInitialStoksProps = {
  selectedAlatName: string;
};

const AlatInitialStok = (props: AlatInitialStoksProps) => {
  const { selectedAlatName } = props;

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const [toConfirm, setToConfirm] = useState(false);

  const {
    data: initialStokValue,
    isLoading,
    error,
  } = useGetInitialStok(selectedAlatName);

  let dataList: InitialStokSchema | undefined;
  let dataSingle: CamelKeys<InitialStokSchema[number]> | undefined;

  const validateInitialStokValue = (initialStokValue: InitialStokSchema) => {
    if (initialStokValue.length === 0)
      throw new Error(
        `No records found when searching for ${selectedAlatName}`
      );
    if (initialStokValue.length > 1)
      throw new Error(
        `More than one record found when searching for ${selectedAlatName}`
      );
    return;
  };

  if (isLoading) {
    dataList = undefined;
  } else if (initialStokValue !== undefined) {
    dataList = initialStokValue;
    if (dataList !== undefined) {
      validateInitialStokValue(dataList);
      dataSingle = camelKeys(dataList[0]!);
    }
  }

  const { showToast } = useToastContext();

  const mutation = useAddInitialStok({
    onSuccess: async () => {
      showToast("success", "Stok successfully changed");
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: initialStokKeys.all,
      });
    },
  });
  const { isPending, variables, isError: isAddInitialStokError } = mutation;

  const serverInitialStokValues = variables || dataSingle;

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AlatInitialStokInputs>({
    values: serverInitialStokValues,
  });

  const watchInitialStok = watch("initialStok");

  if (!initialStokValue) {
    return null;
  }

  if (initialStokValue.length !== 1)
    throw new Error(
      `More than one record found when searching for ${selectedAlatName}`
    );

  const onSubmit: SubmitHandler<AlatInitialStokInputs> = async (data) => {
    if (data.initialStok === null)
      throw Error("Cannot submit an empty initial stok");

    if (!toConfirm) {
      setToConfirm(true);
      return;
    }

    setToConfirm(false);

    mutation.mutate({
      initialStok: data.initialStok,
      alatName: selectedAlatName,
    });

    if (error) throw error;

    reset();
    inputRef.current?.blur();
  };

  const createErrorText = (): ReactNode => {
    if (isAddInitialStokError) {
      return (
        <span className="font-medium">
          Error adding new row, please try again
        </span>
      );
    }

    if (errors.initialStok) {
      return <span className="font-medium">{errors.initialStok.message}</span>;
    }

    return null;
  };

  const showSubmitButton = Boolean(
    watchInitialStok &&
      watchInitialStok !== serverInitialStokValues?.initialStok
  );

  const { ref: rhfRef, ...rest } = register("initialStok", { required: true });

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
      <h4 className="text-sm font-normal text-gray-600 dark:text-gray-400">
        Stok
      </h4>
      <TextInput
        {...rest}
        ref={(e) => {
          rhfRef(e);
          inputRef.current = e;
        }}
        type="number"
        id="initialStok"
        name="initialStok"
        className={isPending ? "opacity-50" : undefined}
        placeholder="Enter initial stok value"
        color={errors.initialStok && "failure"}
        helperText={createErrorText()}
      />
      <div></div>
      {showSubmitButton && (
        <Button
          onMouseDown={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
            e.preventDefault()
          }
          type="submit"
        >
          {!toConfirm ? "Input" : "Confirm"}
        </Button>
      )}
    </form>
  );
};

export default AlatInitialStok;
