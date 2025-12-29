import { useMutation } from "@tanstack/react-query";
import { Button, Progress } from "flowbite-react";
import { useState } from "react";
import { HiPlus } from "react-icons/hi";
import { useToastContext } from "../../../../context/ToastContext";
import generateAllRekapans, {
  ProgressUpdate,
} from "../../../../helpers/createRekapan/generateAllRekapans/generateAllRekapans";
import { InitialTotalSewaAlat } from "../../grid/handleGenerateRekapan/buildInitialRekapanFromValues/buildInitialRekapanFromValues";
import { useFirstOneContext } from "../first-one-provider";

type GenerateAllRekapansButtonProps = {
  initialTotalSewaAlat?: InitialTotalSewaAlat;
};

const getStatusLabel = (status: ProgressUpdate["status"]) => {
  switch (status) {
    case "fetching-data":
      return "Fetching data";
    case "generating":
      return "Generating worksheet";
    case "uploading":
      return "Uploading";
    case "completed":
      return "Done";
  }
};

const GenerateAllRekapansButton = (
  props: GenerateAllRekapansButtonProps = {}
) => {
  const { initialTotalSewaAlat = {} } = props;
  const [progress, setProgress] = useState<ProgressUpdate | null>(null);

  const {
    startRekapanCreationDate,
    endRekapanCreationDate,
    isAnyDateSelectedForStartRekapanCreation,
  } = useFirstOneContext();

  const { showToast } = useToastContext();

  const handleProgress = (update: ProgressUpdate) => {
    setProgress(update);
  };

  const {
    isPending,
    error,
    mutate: mutateGenerateAllRekapans,
  } = useMutation({
    mutationFn: () =>
      generateAllRekapans(
        startRekapanCreationDate!,
        endRekapanCreationDate!,
        initialTotalSewaAlat,
        handleProgress
      ),
    onSuccess: () => {
      setProgress(null);
    },
    onError: () => {
      setProgress(null);
    },
  });

  const handleGenerateAllRekapans = () => {
    if (!isAnyDateSelectedForStartRekapanCreation) {
      showToast("error", "Please select a date for the rekapan start date");
      return;
    }

    if (
      startRekapanCreationDate === undefined ||
      endRekapanCreationDate === undefined
    ) {
      showToast("error", "Please select a date for the rekapan end date");
      return;
    }

    setProgress(null);
    mutateGenerateAllRekapans();
  };

  const renderProgress = () => {
    if (!isPending || !progress) return null;

    const percentComplete = Math.round(
      ((progress.currentMonth - 1) / progress.totalMonths) * 100 +
        (progress.status === "completed" ? 100 / progress.totalMonths : 0)
    );

    return (
      <div className="mt-4 w-full max-w-md">
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {progress.monthName}
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            {progress.currentMonth} of {progress.totalMonths}
          </span>
        </div>
        <Progress progress={percentComplete} color="blue" size="lg" />
        <div className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
          {getStatusLabel(progress.status)}...
        </div>
      </div>
    );
  };

  if (error) throw error;

  return (
    <div className="flex flex-col items-start">
      <Button
        data-testid="generate-all-rekapans-button"
        disabled={isPending}
        color="primary"
        className="flex items-center gap-x-2"
        onClick={handleGenerateAllRekapans}
      >
        <HiPlus className="text-xl" />
        <p>{isPending ? "Generating..." : "Generate all rekapans"}</p>
      </Button>

      {renderProgress()}
    </div>
  );
};

export default GenerateAllRekapansButton;
