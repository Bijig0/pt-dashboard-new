import { Button, Modal } from "flowbite-react";
import { HiArrowRight } from "react-icons/hi";
import { useLocale } from "../../../../context/LocaleContext";
import { ExampleStokAlatViewer } from "./example-stok-alat-viewer";
import { ExampleGenerateRekapanViewer } from "./example-generate-rekapan-viewer";
import { exampleStokAlat1 } from "./data/example-stok-alat-1";
import { exampleStokAlat2 } from "./data/example-stok-alat-2";
import { exampleRekapan } from "./data/example-rekapan";

type Props = {
  showExampleModal: boolean;
  setShowExampleModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ExampleFlowModal = (props: Props) => {
  const { showExampleModal, setShowExampleModal } = props;
  const { t } = useLocale();

  // Combine all example Stok Alat data
  const stokAlatExamples = [exampleStokAlat1, exampleStokAlat2];

  return (
    <Modal
      dismissible
      show={showExampleModal}
      onClose={() => setShowExampleModal(false)}
      size="5xl"
    >
      <Modal.Header>{t.generateRekapan.exampleModal.title}</Modal.Header>
      <Modal.Body>
        <div className="max-h-[70vh] overflow-y-auto space-y-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {t.generateRekapan.exampleModal.description}
          </p>

          {/* Stok Alat Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                {t.generateRekapan.exampleModal.stokAlatData}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({t.generateRekapan.exampleModal.input})
              </span>
            </div>
            <ExampleStokAlatViewer examples={stokAlatExamples} />
          </div>

          {/* Arrow */}
          <div className="flex justify-center py-2">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <div className="h-px w-16 bg-gray-300 dark:bg-gray-600"></div>
              <HiArrowRight className="h-5 w-5" />
              <div className="h-px w-16 bg-gray-300 dark:bg-gray-600"></div>
            </div>
          </div>

          {/* Generate Rekapan Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                {t.generateRekapan.exampleModal.generatedRekapan}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({t.generateRekapan.exampleModal.output})
              </span>
            </div>
            <ExampleGenerateRekapanViewer data={exampleRekapan} />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setShowExampleModal(false)}>{t.common.close}</Button>
      </Modal.Footer>
    </Modal>
  );
};
