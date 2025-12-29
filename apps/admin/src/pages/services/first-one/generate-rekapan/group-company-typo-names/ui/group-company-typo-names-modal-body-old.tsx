import logger from "@logger";
import { useMachine } from "@xstate/react";
import { Button, Checkbox, Modal, Radio, Table } from "flowbite-react";
import * as A from "fp-ts/Array";
import { contramap } from "fp-ts/lib/Ord";
import { pipe } from "fp-ts/lib/function";
import * as S from "fp-ts/string";
import { useMemo, useState } from "react";
import { Pagination } from "../../../../../../../src/components/pagination/pagination";
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
  const {
    currentMonthStokAlatData,
    handleModalConfirmation,
    prevMonthCorrectCompanyNames,
  } = props;

  logger.debug({ currentMonthStokAlatData, prevMonthCorrectCompanyNames });

  // Only run this once to seed the machine, afterwards delegate responsibility to the machine
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

  logger.debug({ prevMonthCorrectCompanyNames });

  const [state, send, actorRef] = useMachine(groupCompanyTypoNamesMachine);

  logger.debug({ currentMonthStokAlatData });

  const [pageItems, setPageItems] = useState<Row[]>([]);

  const pageItemsToUse = pageItems;

  logger.debug({ pageItemsToUse });

  logger.debug("Rendering");

  const handleClearSelectedItems = () => {
    // setSelectedItem({ listIndex: null, itemIndex: null });
    // setCompanyTypoNameToMove(undefined);
    // setDestinationCompanyTypoNamesToMoveTo(undefined);
  };

  logger.debug(`state value is ${JSON.stringify(state.value)}`);

  // Use contramap to create a new Ord instance for the Company type,
  // ordering by the `clusteredCompanyNames` property
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

  // logger.debug({ sorted });

  logger.debug(state.context.clusteredCompanyNames);

  console.log(state.value);

  return (
    <Modal.Body className="pb-0">
      <div className="flex items-center mb-3 justify-left gap-4">
        <div className="flex items-center mb-3">
          <label htmlFor="move-checkbox" className="text-sm mr-4">
            Move
          </label>
          <Checkbox
            checked={state.matches("moveStarted")}
            onChange={() => send({ type: "TOGGLE_START_MOVE" })}
            id="move-checkbox"
            name="move-checkbox"
          />
        </div>
        <div className="flex items-center mb-3">
          <Button onClick={handleClearSelectedItems}>Clear</Button>
        </div>

        {state.matches("moveStarted") && (
          <div>
            <div className="flex items-center mb-3">
              <p className="text-sm mr-4">Select Typo Name To Move</p>
              <Radio
                checked={state.matches({ moveStarted: "selectingToMove" })}
                onChange={() =>
                  send({ type: "TOGGLE_COMPANY_TYPO_NAME_TO_MOVE_SELECTED" })
                }
              />
            </div>
            <div className="flex items-center mb-3">
              <label htmlFor="lock-in-checkbox" className="text-sm mr-4">
                Lock in Typo Name To Move
              </label>
              <Radio
                checked={state.matches({
                  moveStarted: { destinationSelecting: "selectedToMove" },
                })}
                onChange={() =>
                  send({ type: "TOGGLE_COMPANY_TYPO_NAME_TO_MOVE_SELECTED" })
                }
                id="lock-in-checkbox"
                name="lock-in-checkbox"
                data-testid="lock-in-checkbox"
              />
            </div>

            {state.matches({
              moveStarted: "destinationSelecting",
            }) && (
              <div className="flex items-center mb-3">
                <div className="flex items-center mb-3">
                  <label htmlFor="destination-typo-name-checkbox">
                    <p className="text-sm mr-4">Select Typo Name Destination</p>
                  </label>
                  <Radio
                    onChange={() =>
                      send({ type: "START_MOVE_TO_EXISTING_DESTINATION_ROW" })
                    }
                    id="destination-typo-name-checkbox"
                    name="destination-typo-name-checkbox"
                    data-testid="destination-typo-name-checkbox"
                  />
                </div>

                <div className="flex items-center mb-3">
                  {state.matches({
                    moveStarted: {
                      destinationSelecting: "selectedToMove",
                    },
                  }) && (
                    <Button
                      data-testid="move-to-new-button"
                      onClick={() =>
                        send({ type: "START_MOVE_TO_NEW_DESTINATION" })
                      }
                    >
                      Move To New
                    </Button>
                  )}

                  {state.matches({
                    moveStarted: {
                      destinationSelecting: "selectedDestination",
                    },
                  }) && (
                    <Button
                      data-testid="confirm-move-to-destination-button"
                      onClick={() =>
                        send({
                          type: "CONFIRM_MOVE_TYPO_NAME_TO_DESTINATION_ROW",
                        })
                      }
                    >
                      Confirm move to Destination
                    </Button>
                  )}
                  {state.matches({
                    moveStarted: {
                      destinationSelecting: "newDestinationSelected",
                    },
                  }) && (
                    <Button
                      onClick={() =>
                        send({ type: "CONFIRM_MOVE_TYPO_NAME_TO_NEW" })
                      }
                      data-testid="confirm-move-to-new-button"
                    >
                      Confirm move to new
                    </Button>
                  )}
                </div>
              </div>
            )}
            {state.matches({
              moveStarted: {
                destinationSelecting: "selectingDestination",
              },
            }) &&
              state.context.destinationCompanyName && (
                <div>
                  <label
                    className="text-sm"
                    htmlFor="lock-in-destination-checkbox"
                  >
                    Lock in destination
                  </label>
                  <Radio
                    data-testid="lock-in-destination-checkbox"
                    id="lock-in-destination-checkbox"
                    name="lock-in-destination-checkbox"
                    onChange={() =>
                      send({
                        type: "TOGGLE_COMPANY_TYPO_NAME_DESTINATION_SELECTED",
                      })
                    }
                  />
                </div>
              )}
          </div>
        )}
      </div>

      <div>
        Company Typo Name To Move is{" "}
        {state.context.companyTypoNameToMove?.typoCompanyNameToMove}
      </div>
      <div>
        Destination Company Typo Names To Move To is{" "}
        {state.context.destinationCompanyName?.correctCompanyName}
      </div>

      <div className="grid grid-cols-1">
        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              {state.matches("moveStarted") && (
                <Table.HeadCell></Table.HeadCell>
              )}
              <Table.HeadCell>Nama Alat</Table.HeadCell>
              <Table.HeadCell>Corrected Alat Name</Table.HeadCell>
              <Table.HeadCell>Potential Found</Table.HeadCell>
            </Table.Head>
            <div className="divide-y">
              {pageItemsToUse.map(
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
                    />
                  );
                }
              )}
            </div>
          </Table>
        </div>
        <Pagination
          items={sortedByCorrectCompanyName}
          itemsPerPage={8}
          setPageItems={setPageItems}
        />
      </div>
      <Button
        onClick={() =>
          handleModalConfirmation(state.context.clusteredCompanyNames)
        }
      >
        Cluster
      </Button>
    </Modal.Body>
  );
};

export default GroupCompanyTypoNamesModalBody;
