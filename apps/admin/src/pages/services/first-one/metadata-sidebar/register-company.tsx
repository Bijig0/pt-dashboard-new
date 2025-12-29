import { Button, TextInput } from "flowbite-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ZodSchema, z } from "zod";
import { useToastContext } from "../../../../context/ToastContext";
import useRegisterCompany from "../../../../hooks/useRegisterCompany";
import { companyNamesKeys, queryClient } from "../../../../react-query";
import { retrieveErrorType } from "../../../../supabase";
import { isQueryError } from "../../../../types/schemas";

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

export default RegisterCompany;
