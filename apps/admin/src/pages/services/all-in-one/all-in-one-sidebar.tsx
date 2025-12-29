import { Button, Select, TextInput } from "flowbite-react";
import React, {
  ForwardedRef,
  ReactNode,
  SetStateAction,
  forwardRef,
  useState,
} from "react";
import { HiMenuAlt1 } from "react-icons/hi";
import { useToggle } from "usehooks-ts";
import useGetCompanyNames from "../../../hooks/useGetCompanyNames";

type MetadataSidebarProps = {
  selectedDate: Date;
  dates: Date[];
  setSelectedDate: React.Dispatch<SetStateAction<Date>>;
  alatNamesList: string[];
  selectedAlatName: string;
  setSelectedAlatName: React.Dispatch<SetStateAction<string>>;
};

const MetadataSidebar = function (
  props: MetadataSidebarProps,
  gridRef: ForwardedRef<AgGridReact<Row>>
) {
  const {
    selectedAlatName,
    setSelectedAlatName,
    alatNamesList,
    dates,
    selectedDate,
    setSelectedDate,
  } = props;

  const { data: companyNames, isLoading, error } = useGetCompanyNames();

  const [sidebarOpen, toggle] = useToggle(true);

  const worksheetName = selectedAlatName;

  if (isLoading || error) return;
  if (!companyNames) return;

  if (!sidebarOpen) {
    return (
      <>
        <div className="mb-4 h-full rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <button className="cursor-pointer rounded text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:inline">
              <HiMenuAlt1 onClick={toggle} className="h-6 w-6" />
            </button>
          </div>
          <div className="flow-root">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700 flex-col">
              <li className="py-3 sm:py-4">
                <div className="my-2"></div>
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700 sm:pt-6"></div>
        </div>
        ;
      </>
    );
  }

  return (
    <div className="mb-4 h-full rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
          Metadata
        </h3>
        <div className="mx-3"></div>
        <button className="cursor-pointer rounded text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:inline">
          <HiMenuAlt1 onClick={toggle} className="h-6 w-6" />
        </button>
      </div>
      <div className="flow-root">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 flex-col">
          <li className="py-3 sm:py-4">
            <AddRowButton worksheetName={worksheetName} ref={gridRef} />
          </li>
          <li>
            <AlatInitialStok selectedAlatName={selectedAlatName} />
          </li>
          <div className="my-1"></div>
          <li>
            <DateForGrid
              dates={dates}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </li>
          <li className="py-3 sm:py-4">
            <h4 className="text-sm font-normal text-gray-600 dark:text-gray-400">
              Select your workbook
            </h4>
            <div className="my-2"></div>
            <div className="">
              <Select
                value={selectedAlatName}
                id="company-choices"
                name="Company Choices"
                onChange={(e) => setSelectedAlatName(e.target.value)}
              >
                {alatNamesList.map((alatName) => (
                  <option className="w-full" key={alatName} value={alatName}>
                    {alatName}
                  </option>
                ))}
              </Select>
            </div>
          </li>
          <li className="py-3 sm:py-4">
            <RegisteredCompaniesList companyNames={companyNames!} />
          </li>
          <li className="py-3 sm:py-4">
            <RegisterCompany />
          </li>
        </ul>
      </div>
      <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700 sm:pt-6"></div>
    </div>
  );
};

export default forwardRef(MetadataSidebar);

type AlatInitialStokInputs = {
  initialStok: number | null;
};

type AlatInitialStoksProps = {
  selectedAlatName: string;
};

import { CamelKeys, camelKeys } from "string-ts";

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

type ActionsProps = {
  worksheetName: string;
};

const AddRowButton = forwardRef(
  (props: ActionsProps, gridRef: ForwardedRef<AgGridReact<Row>>) => {
    const { worksheetName } = props;

    const handleAddRows = async () => {
      function generareEmptyRows(
        alatName: string,
        count: number = 50
      ): Array<{
        masuk: any;
        keluar: any;
        tanggal: any;
        company_name: any;
        alat_name: any;
      }> {
        let result = [];
        for (let i = 0; i < count; i++) {
          result.push({
            masuk: null,
            keluar: null,
            tanggal: null,
            company_name: null,
            alat_name: alatName,
          });
        }
        return result;
      }

      const emptyRows = generareEmptyRows(worksheetName);
      // @ts-ignore
      gridRef?.current?.api.applyTransaction({ add: emptyRows });
    };

    return (
      <Button className="w-full" onClick={handleAddRows}>
        Add rows
      </Button>
    );
  }
);

type DateForGridProps = {
  dates: Date[];
  selectedDate: Date;
  setSelectedDate: React.Dispatch<SetStateAction<Date>>;
};

const DateForGrid = (props: DateForGridProps) => {
  const { dates, selectedDate, setSelectedDate } = props;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const formattedDates = dates.map((date) => formatDate(date));

  const formattedSelectedDate = formatDate(selectedDate);
  return (
    <form className="gap-y-2 flex flex-col">
      <h4 className="text-sm font-normal text-gray-600 dark:text-gray-400">
        Date for input
      </h4>
      <Select
        value={formattedSelectedDate}
        id="date"
        name="date"
        onChange={(e) => setSelectedDate(new Date(e.target.value))}
      >
        {formattedDates.map((formattedDate) => (
          <option className="w-full" key={formattedDate} value={formattedDate}>
            {formattedDate}
          </option>
        ))}
      </Select>
    </form>
  );
};

type RegisteredCompaniesListProps = {
  companyNames: string[];
};

const RegisteredCompaniesList = (props: RegisteredCompaniesListProps) => {
  const { companyNames } = props;

  return (
    <div>
      <h4 className="text-sm font-normal text-gray-600 dark:text-gray-400">
        View registered companies
      </h4>
      <div className="my-2"></div>
      <Select
        onChange={() => {}}
        aria-readonly
        value={"choice"}
        id="cregistered-companies"
        name="Registered Companies"
      >
        <option key={"choice"} value={"View registered companies"}>
          View registered companies
        </option>
        {companyNames?.map((companyName) => (
          <option key={companyName} value={companyName}>
            {companyName}
          </option>
        ))}
      </Select>
    </div>
  );
};

import { AgGridReact } from "ag-grid-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ZodSchema, z } from "zod";
import { useToastContext } from "../../../context/ToastContext";
import useAddInitialStok from "../../../hooks/useAddInitialStok";
import useGetInitialStok from "../../../hooks/useGetInitialStok";
import useRegisterCompany from "../../../hooks/useRegisterCompany";
import {
  companyNamesKeys,
  initialStokKeys,
  queryClient,
} from "../../../react-query";
import { retrieveErrorType } from "../../../supabase";
import { Row } from "../../../types/globals";
import { InitialStokSchema, isQueryError } from "../../../types/schemas";

type Inputs = {
  company: string;
};

const RegisterCompany = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();
  const [toConfirm, setToConfirm] = useState(false);
  const [remoteErrorMessage, setRemoteErrorMessage] = useState<string | null>(
    null
  );

  const mutationErrorContextWrapper = <
    Schema extends ZodSchema,
    Key extends string,
  >(
    context: any,
    schema: Record<Key, Schema>
  ) => {
    const mutationErrorContextWrapperSchema = z.object({
      ...schema,
    });

    type MutationErrorContextWrapperSchema = z.infer<
      typeof mutationErrorContextWrapperSchema
    >;

    const result = mutationErrorContextWrapperSchema.safeParse(context);

    if (!result.success) throw result.error;

    return mutationErrorContextWrapperSchema.parse(
      context
    ) as MutationErrorContextWrapperSchema;
  };

  const companyNamesListSchema = z.array(z.string());

  type CompanyNamesListSchema = z.infer<typeof companyNamesListSchema>;

  const { showToast } = useToastContext();

  const mutation = useRegisterCompany({
    onSuccess: async () => {
      showToast("success", "Company successfully registered");
    },
    onMutate: async (newCompanyName) => {
      await queryClient.cancelQueries({ queryKey: companyNamesKeys.lists() });

      // Snapshot the previous value
      const prevCompanyNames = queryClient.getQueryData(
        companyNamesKeys.lists()
      );

      const parsedPrevCompanyNames =
        companyNamesListSchema.parse(prevCompanyNames);

      // Optimistically update to the new value
      queryClient.setQueryData(companyNamesKeys.lists(), [
        ...parsedPrevCompanyNames,
        newCompanyName,
      ]);

      // Return a context object with the snapshotted value
      return { parsedPrevCompanyNames };
    },
    onError: (error, newCompanyName, context) => {
      const parsedContext = mutationErrorContextWrapper(context, {
        parsedPrevCompanyNames: companyNamesListSchema,
      });
      queryClient.setQueryData<CompanyNamesListSchema>(
        companyNamesKeys.lists(),
        parsedContext.parsedPrevCompanyNames
      );

      if (!isQueryError(error)) {
        throw error;
      }
      const errorDetail = retrieveErrorType(error);

      if (!(typeof errorDetail === "string")) {
        throw errorDetail;
      }

      setRemoteErrorMessage(errorDetail);
      showToast("error", "Error registering company");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: companyNamesKeys.lists() });
    },
    mutationKey: companyNamesKeys.registerCompanyName(),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!toConfirm) {
      setToConfirm(true);
      return;
    }
    setToConfirm(false);

    mutation.mutate(data.company);

    reset();
  };

  const isError = Boolean(remoteErrorMessage || errors.company);

  const errorMessage =
    remoteErrorMessage || errors.company?.message || "This field is required";

  return (
    <form className="gap-y-2 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <h4 className="text-sm font-normal text-gray-600 dark:text-gray-400">
        Register a company
      </h4>
      <TextInput
        {...register("company", {
          required: true,
          onChange: () =>
            remoteErrorMessage !== null && setRemoteErrorMessage(null),
        })}
        id="company"
        name="company"
        placeholder="Enter a company"
        color={isError ? "failure" : undefined}
        helperText={
          <RegisterCompanyErrorMessage
            show={isError}
            message={errorMessage ?? "Error Please contact admin"}
          />
        }
      />
      <div></div>
      <Button type="submit">{!toConfirm ? "Register" : "Confirm"}</Button>
    </form>
  );
};

type RegisterCompanyErrorMessageProps = {
  show: boolean;
  message: string;
};

const RegisterCompanyErrorMessage = (
  props: RegisterCompanyErrorMessageProps
) => {
  const { show, message } = props;
  if (!show) return null;

  return <span className="font-medium">{message}</span>;
};
