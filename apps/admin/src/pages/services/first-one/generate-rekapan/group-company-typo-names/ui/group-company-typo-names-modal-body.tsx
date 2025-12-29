import logger from "@logger";
import { useMachine } from "@xstate/react";
import { Alert, Button, Card, Modal, Table, ToggleSwitch } from "flowbite-react";
import * as A from "fp-ts/Array";
import { contramap } from "fp-ts/lib/Ord";
import { pipe } from "fp-ts/lib/function";
import * as S from "fp-ts/string";
import { useMemo, useState } from "react";
import {
  HiArrowRight,
  HiCheckCircle,
  HiInformationCircle,
  HiLightBulb,
  HiPencil,
} from "react-icons/hi";
import { Pagination } from "../../../../../../../src/components/pagination/pagination";
import { useLocale } from "../../../../../../context/LocaleContext";
import { objectValues } from "../../../../../../helpers/objectValues";
import { SupabaseWorksheetDataSchema } from "../../../getCurrentMonthStokAlatData/supabaseWorksheetDataSchema/supabaseWorksheetDataSchema";
import { createGroupCompanyTypoNamesMachine } from "../group-company-typo-names-machine";
import { doFullThing } from "../main";
import {
  ClusteredCompanyNames,
  CorrectCompanyName,
  PossibleCorrectCompanyNameFromPrevMonthStokAlat,
  Row,
} from "../types";
import GroupCompanyTypoNamesModalRow from "./group-company-typo-names-modal-row";

type ModalListProps = {
  prevMonthCorrectCompanyNames:
    | Record<
        CorrectCompanyName,
        {
          typoCompanyNames: string[];
          correctCompanyName: CorrectCompanyName;
          possibleCorrectCompanyNameFromPrevMonthStokAlat:
            | PossibleCorrectCompanyNameFromPrevMonthStokAlat
            | undefined;
        }
      >
    | undefined;
  currentMonthStokAlatData: SupabaseWorksheetDataSchema;
  handleModalConfirmation: (
    clusteredCompanyNames: ClusteredCompanyNames
  ) => void;
};

const GroupCompanyTypoNamesModalBody = (props: ModalListProps) => {
  const { t } = useLocale();
  const {
    currentMonthStokAlatData,
    handleModalConfirmation,
    prevMonthCorrectCompanyNames,
  } = props;

  logger.debug({ currentMonthStokAlatData, prevMonthCorrectCompanyNames });

  const clusteredCompanyNames = useMemo(
    () => doFullThing(currentMonthStokAlatData, prevMonthCorrectCompanyNames),
    []
  );

  logger.debug({ clusteredCompanyNames });

  const groupCompanyTypoNamesMachine = useMemo(
    () =>
      createGroupCompanyTypoNamesMachine({
        clusteredCompanyNames,
        companyTypoNameToMove: undefined,
        destinationCompanyName: undefined,
      }),
    []
  );

  const [state, send, actorRef] = useMachine(groupCompanyTypoNamesMachine);
  const [pageItems, setPageItems] = useState<Row[]>([]);
  const [showAdvancedMode, setShowAdvancedMode] = useState(false);

  const correctCompanyNameOrd = pipe(
    S.Ord,
    contramap(
      ({ correctCompanyName }: { correctCompanyName: string }) =>
        correctCompanyName
    )
  );

  const sortedByCorrectCompanyName = useMemo(() => {
    return pipe(
      state.context.clusteredCompanyNames,
      objectValues,
      A.sort(correctCompanyNameOrd)
    );
  }, [state.context.clusteredCompanyNames]);

  const totalClusters = Object.keys(state.context.clusteredCompanyNames).length;
  const clustersWithSuggestions = Object.values(
    state.context.clusteredCompanyNames
  ).filter(
    (row) => row.possibleCorrectCompanyNameFromPrevMonthStokAlat !== undefined
  ).length;

  return (
    <Modal.Body className="space-y-6">
      {/* Info Section */}
      <Alert color="info" icon={HiInformationCircle}>
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">{t.companyTypoGrouping.title}</h3>
          <div className="space-y-2 text-sm">
            <p>
              <strong>{t.companyTypoGrouping.info.whyImportant}</strong>
            </p>
            <p>{t.companyTypoGrouping.info.explanation1}</p>
            <p>{t.companyTypoGrouping.info.explanation2}</p>
          </div>

          <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
            <p className="mb-2 text-sm font-semibold text-blue-900 dark:text-blue-300">
              {t.companyTypoGrouping.info.eachGroupShows}
            </p>
            <ul className="ml-4 list-disc space-y-1 text-sm text-blue-800 dark:text-blue-400">
              <li>
                <strong>{t.companyTypoGrouping.info.nameVariations}</strong> {t.companyTypoGrouping.info.nameVariationsDesc}
              </li>
              <li>
                <strong>{t.companyTypoGrouping.info.standardizedName}</strong> {t.companyTypoGrouping.info.standardizedNameDesc}
              </li>
              <li>
                <strong>{t.companyTypoGrouping.info.previousMonth}</strong> {t.companyTypoGrouping.info.previousMonthDesc}
              </li>
            </ul>
          </div>

          <div className="rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-3 dark:bg-yellow-900/20">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
              <strong>{t.companyTypoGrouping.info.note}</strong> {t.companyTypoGrouping.info.noteText}
            </p>
          </div>
        </div>
      </Alert>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
              <HiInformationCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t.companyTypoGrouping.stats.totalGroups}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalClusters}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
              <HiCheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t.companyTypoGrouping.stats.autoSuggested}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {clustersWithSuggestions}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-3 dark:bg-yellow-900">
              <HiLightBulb className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t.companyTypoGrouping.stats.needReview}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalClusters - clustersWithSuggestions}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Advanced Mode Toggle */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HiPencil className="h-5 w-5 text-gray-500" />
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {t.companyTypoGrouping.advanced.advancedMode}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t.companyTypoGrouping.advanced.advancedModeDesc}
              </p>
            </div>
          </div>
          <ToggleSwitch
            checked={showAdvancedMode}
            onChange={setShowAdvancedMode}
          />
        </div>

        {showAdvancedMode && (
          <div className="mt-4 space-y-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            {/* Move Mode Controls */}
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <div className="mb-3 flex items-center gap-2">
                <HiArrowRight className="h-5 w-5 text-gray-500" />
                <h5 className="font-semibold text-gray-900 dark:text-white">
                  {t.companyTypoGrouping.advanced.moveVariations}
                </h5>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <ToggleSwitch
                    checked={state.matches("moveStarted")}
                    onChange={() => send({ type: "TOGGLE_START_MOVE" })}
                    label={t.companyTypoGrouping.advanced.enableMoveMode}
                  />
                </div>

                {state.matches("moveStarted") && (
                  <div className="space-y-3 rounded-lg bg-white p-3 dark:bg-gray-900">
                    {/* Current Selection Display */}
                    <div className="space-y-2">
                      {state.context.companyTypoNameToMove && (
                        <div className="rounded bg-blue-50 p-2 text-sm dark:bg-blue-900/20">
                          <strong className="text-blue-900 dark:text-blue-300">
                            {t.companyTypoGrouping.advanced.moving}
                          </strong>{" "}
                          <span className="text-blue-700 dark:text-blue-400">
                            {
                              state.context.companyTypoNameToMove
                                .typoCompanyNameToMove
                            }
                          </span>
                        </div>
                      )}

                      {state.context.destinationCompanyName && (
                        <div className="rounded bg-green-50 p-2 text-sm dark:bg-green-900/20">
                          <strong className="text-green-900 dark:text-green-300">
                            {t.companyTypoGrouping.advanced.toGroup}
                          </strong>{" "}
                          <span className="text-green-700 dark:text-green-400">
                            {
                              state.context.destinationCompanyName
                                .correctCompanyName
                            }
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Step Indicators */}
                    <div className="space-y-2">
                      {state.matches({ moveStarted: "selectingToMove" }) && (
                        <Alert color="info" className="py-2">
                          <span className="text-sm">
                            {t.companyTypoGrouping.advanced.step1}
                          </span>
                        </Alert>
                      )}

                      {state.matches({
                        moveStarted: { destinationSelecting: "selectedToMove" },
                      }) && (
                        <Alert color="warning" className="py-2">
                          <span className="text-sm">
                            {t.companyTypoGrouping.advanced.step2}
                          </span>
                        </Alert>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {state.matches({
                        moveStarted: { destinationSelecting: "selectedToMove" },
                      }) && (
                        <Button
                          size="sm"
                          color="blue"
                          onClick={() =>
                            send({ type: "START_MOVE_TO_NEW_DESTINATION" })
                          }
                        >
                          {t.companyTypoGrouping.advanced.createNewGroup}
                        </Button>
                      )}

                      {state.matches({
                        moveStarted: {
                          destinationSelecting: "selectedDestination",
                        },
                      }) && (
                        <Button
                          size="sm"
                          color="success"
                          onClick={() =>
                            send({
                              type: "CONFIRM_MOVE_TYPO_NAME_TO_DESTINATION_ROW",
                            })
                          }
                        >
                          {t.companyTypoGrouping.advanced.confirmMove}
                        </Button>
                      )}

                      {state.matches({
                        moveStarted: {
                          destinationSelecting: "newDestinationSelected",
                        },
                      }) && (
                        <Button
                          size="sm"
                          color="success"
                          onClick={() =>
                            send({ type: "CONFIRM_MOVE_TYPO_NAME_TO_NEW" })
                          }
                        >
                          {t.companyTypoGrouping.advanced.confirmNewGroup}
                        </Button>
                      )}

                      {state.matches("moveStarted") && (
                        <Button
                          size="sm"
                          color="gray"
                          onClick={() => send({ type: "TOGGLE_START_MOVE" })}
                        >
                          {t.companyTypoGrouping.advanced.cancelMove}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Company Groups Table */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t.companyTypoGrouping.title}
        </h3>

        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              {showAdvancedMode && state.matches("moveStarted") && (
                <Table.HeadCell className="w-16">
                  {t.companyTypoGrouping.table.select}
                </Table.HeadCell>
              )}
              <Table.HeadCell>{t.companyTypoGrouping.table.nameVariations}</Table.HeadCell>
              <Table.HeadCell>{t.companyTypoGrouping.table.standardizedName}</Table.HeadCell>
              <Table.HeadCell>{t.companyTypoGrouping.table.previousMonth}</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {pageItems.map(
                ({
                  typoCompanyNames,
                  correctCompanyName,
                  possibleCorrectCompanyNameFromPrevMonthStokAlat,
                }) => {
                  return (
                    <GroupCompanyTypoNamesModalRow
                      key={JSON.stringify(typoCompanyNames)}
                      actorRef={actorRef}
                      correctCompanyName={correctCompanyName}
                      typoCompanyNames={typoCompanyNames}
                      possibleCorrectCompanyNameFromPrevMonthStokAlat={
                        possibleCorrectCompanyNameFromPrevMonthStokAlat
                      }
                      showAdvancedMode={showAdvancedMode}
                    />
                  );
                }
              )}
            </Table.Body>
          </Table>
        </div>

        <Pagination
          items={sortedByCorrectCompanyName}
          itemsPerPage={8}
          setPageItems={setPageItems}
        />
      </div>

      {/* Confirm Button */}
      <div className="flex justify-end border-t border-gray-200 pt-4 dark:border-gray-700">
        <Button
          size="lg"
          onClick={() =>
            handleModalConfirmation(state.context.clusteredCompanyNames)
          }
          className="flex items-center gap-2"
        >
          <HiCheckCircle className="h-5 w-5" />
          {t.companyTypoGrouping.confirmAndContinue}
        </Button>
      </div>
    </Modal.Body>
  );
};

export default GroupCompanyTypoNamesModalBody;
