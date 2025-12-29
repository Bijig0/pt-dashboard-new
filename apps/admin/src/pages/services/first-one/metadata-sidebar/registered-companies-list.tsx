import { Button, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { HiPencil, HiTrash } from "react-icons/hi";
import { z } from "zod";
import { useToastContext } from "../../../../context/ToastContext";
import useDeleteCompany from "../../../../hooks/useDeleteCompany";
import useUpdateCompany from "../../../../hooks/useUpdateCompany";
import { companyNamesKeys, queryClient } from "../../../../react-query";
import { retrieveErrorType } from "../../../../supabase";
import { isQueryError } from "../../../../types/schemas";

type RegisteredCompaniesListProps = {
  companyNames: string[];
  searchQuery?: string;
  totalCount?: number;
};

const RegisteredCompaniesList = (props: RegisteredCompaniesListProps) => {
  const { companyNames, searchQuery = "", totalCount } = props;
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  // Highlight matched text
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);

    if (index === -1) return text;

    const before = text.slice(0, index);
    const match = text.slice(index, index + query.length);
    const after = text.slice(index + query.length);

    return (
      <>
        {before}
        <strong className="font-bold text-blue-700 dark:text-blue-300">
          {match}
        </strong>
        {after}
      </>
    );
  };

  const handleEditClick = (companyName: string) => {
    setSelectedCompany(companyName);
    setShowEditModal(true);
  };

  const handleDeleteClick = (companyName: string) => {
    setSelectedCompany(companyName);
    setShowDeleteModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedCompany(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedCompany(null);
  };

  if (!companyNames || companyNames.length === 0) {
    // Show different message if filtering vs actually empty
    const message = searchQuery
      ? `No companies found matching "${searchQuery}"`
      : "No companies registered yet.";

    return (
      <div>
        <h4 className="text-sm font-normal text-gray-600 dark:text-gray-400 mb-2">
          Registered Companies
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
      </div>
    );
  }

  const countText = searchQuery && totalCount !== undefined
    ? `Showing ${companyNames.length} of ${totalCount}`
    : `${companyNames.length}`;

  return (
    <div>
      <h4 className="text-sm font-normal text-gray-600 dark:text-gray-400 mb-2">
        Registered Companies ({countText})
      </h4>
      <div className="max-h-60 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-600">
        {companyNames.map((companyName) => (
          <div
            key={companyName}
            className="flex items-center justify-between border-b border-gray-200 bg-white px-3 py-2 last:border-b-0 dark:border-gray-600 dark:bg-gray-700"
          >
            <span className="text-sm text-gray-900 dark:text-white">
              {highlightMatch(companyName, searchQuery)}
            </span>
            <div className="flex gap-2">
              <Button
                size="xs"
                color="light"
                onClick={() => handleEditClick(companyName)}
              >
                <HiPencil className="h-4 w-4" />
              </Button>
              <Button
                size="xs"
                color="failure"
                onClick={() => handleDeleteClick(companyName)}
              >
                <HiTrash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {selectedCompany && (
        <EditCompanyModal
          show={showEditModal}
          companyName={selectedCompany}
          onClose={handleCloseEditModal}
        />
      )}

      {/* Delete Modal */}
      {selectedCompany && (
        <DeleteCompanyModal
          show={showDeleteModal}
          companyName={selectedCompany}
          onClose={handleCloseDeleteModal}
        />
      )}
    </div>
  );
};

type EditCompanyModalProps = {
  show: boolean;
  companyName: string;
  onClose: () => void;
};

type EditInputs = {
  newCompanyName: string;
};

const EditCompanyModal = (props: EditCompanyModalProps) => {
  const { show, companyName, onClose } = props;
  const { showToast } = useToastContext();
  const [remoteErrorMessage, setRemoteErrorMessage] = useState<string | null>(
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<EditInputs>({
    defaultValues: {
      newCompanyName: companyName,
    },
  });

  const currentValue = watch("newCompanyName");
  const hasChanges = currentValue !== companyName;

  const companyNamesListSchema = z.array(z.string());

  const mutation = useUpdateCompany({
    onSuccess: async () => {
      showToast("success", "Company updated successfully");
      onClose();
      reset();
    },
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: companyNamesKeys.lists() });

      const prevCompanyNames = queryClient.getQueryData(
        companyNamesKeys.lists()
      );

      const parsedPrevCompanyNames =
        companyNamesListSchema.parse(prevCompanyNames);

      // Optimistically update
      const updatedCompanyNames = parsedPrevCompanyNames.map((name) =>
        name === params.oldName ? params.newName : name
      );
      queryClient.setQueryData(companyNamesKeys.lists(), updatedCompanyNames);

      return { parsedPrevCompanyNames };
    },
    onError: (error, variables, context: any) => {
      queryClient.setQueryData(
        companyNamesKeys.lists(),
        context?.parsedPrevCompanyNames
      );

      if (!isQueryError(error)) {
        throw error;
      }
      const errorDetail = retrieveErrorType(error);

      if (typeof errorDetail === "string") {
        setRemoteErrorMessage(errorDetail);
      }
      showToast("error", "Error updating company");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: companyNamesKeys.lists() });
    },
  });

  const onSubmit: SubmitHandler<EditInputs> = async (data) => {
    if (data.newCompanyName === companyName) {
      onClose();
      return;
    }

    mutation.mutate({
      oldName: companyName,
      newName: data.newCompanyName,
    });
  };

  const isError = Boolean(remoteErrorMessage || errors.newCompanyName);
  const errorMessage =
    remoteErrorMessage ||
    errors.newCompanyName?.message ||
    "This field is required";

  return (
    <Modal dismissible show={show} onClose={onClose} size="md">
      <Modal.Header>Edit Company Name</Modal.Header>
      <Modal.Body>
        <form
          id="edit-company-form"
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label
              htmlFor="newCompanyName"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Company Name
            </label>
            <TextInput
              {...register("newCompanyName", {
                required: "Company name is required",
                onChange: () =>
                  remoteErrorMessage !== null && setRemoteErrorMessage(null),
              })}
              id="newCompanyName"
              placeholder="Enter company name"
              color={isError ? "failure" : undefined}
              helperText={isError ? errorMessage : undefined}
            />
          </div>

          {/* Unsaved Changes Warning */}
          {hasChanges && (
            <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                Unsaved Changes
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                These changes will not be saved until you click Save Changes.
              </p>
            </div>
          )}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="submit"
          form="edit-company-form"
          disabled={!hasChanges || mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

type DeleteCompanyModalProps = {
  show: boolean;
  companyName: string;
  onClose: () => void;
};

const DeleteCompanyModal = (props: DeleteCompanyModalProps) => {
  const { show, companyName, onClose } = props;
  const { showToast } = useToastContext();

  const companyNamesListSchema = z.array(z.string());

  const mutation = useDeleteCompany({
    onSuccess: async () => {
      showToast("success", "Company deleted successfully");
      onClose();
    },
    onMutate: async (deletedCompanyName) => {
      await queryClient.cancelQueries({ queryKey: companyNamesKeys.lists() });

      const prevCompanyNames = queryClient.getQueryData(
        companyNamesKeys.lists()
      );

      const parsedPrevCompanyNames =
        companyNamesListSchema.parse(prevCompanyNames);

      // Optimistically update
      const updatedCompanyNames = parsedPrevCompanyNames.filter(
        (name) => name !== deletedCompanyName
      );
      queryClient.setQueryData(companyNamesKeys.lists(), updatedCompanyNames);

      return { parsedPrevCompanyNames };
    },
    onError: (error, variables, context: any) => {
      queryClient.setQueryData(
        companyNamesKeys.lists(),
        context?.parsedPrevCompanyNames
      );
      showToast("error", "Error deleting company");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: companyNamesKeys.lists() });
    },
  });

  const handleDelete = () => {
    mutation.mutate(companyName);
  };

  return (
    <Modal dismissible show={show} onClose={onClose} size="md">
      <Modal.Header>Delete Company</Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            Are you sure you want to delete{" "}
            <strong className="text-gray-900 dark:text-white">
              {companyName}
            </strong>
            ?
          </p>
          <p className="text-sm text-red-600 dark:text-red-400">
            This action cannot be undone. Any existing records with this company
            name may be affected.
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          color="failure"
          onClick={handleDelete}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Deleting..." : "Delete"}
        </Button>
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RegisteredCompaniesList;
