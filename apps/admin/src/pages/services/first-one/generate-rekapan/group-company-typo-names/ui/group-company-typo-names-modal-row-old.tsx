import logger from "@logger";
import { useSelector } from "@xstate/react";
import { Radio, Table, TextInput } from "flowbite-react";
import { identity } from "fp-ts/lib/function";
import { useState } from "react";
import { ActorRefFrom } from "xstate";
import { createGroupCompanyTypoNamesMachine } from "../group-company-typo-names-machine";
import {
  CorrectCompanyName,
  PossibleCorrectCompanyNameFromPrevMonthStokAlat,
} from "../types";

type Props = {
  actorRef: ActorRefFrom<ReturnType<typeof createGroupCompanyTypoNamesMachine>>;
  typoCompanyNames: string[];
  correctCompanyName: CorrectCompanyName;
  possibleCorrectCompanyNameFromPrevMonthStokAlat:
    | PossibleCorrectCompanyNameFromPrevMonthStokAlat
    | undefined;
};

const GroupCompanyTypoNamesModalRow = (props: Props) => {
  const {
    actorRef,
    typoCompanyNames,
    correctCompanyName,
    possibleCorrectCompanyNameFromPrevMonthStokAlat,
  } = props;
  const state = useSelector(actorRef, identity);
  const send = actorRef.send;

  const checked =
    typoCompanyNames.includes(
      // @ts-ignore
      state.context.companyTypoNameToMove?.typoCompanyNameToMove
    ) ||
    typoCompanyNames.includes(
      // @ts-ignore
      state.context.destinationCompanyName?.correctCompanyName
    );

  const [userInputCompanyName, setUserInputCompanyName] = useState<
    string | undefined
  >(undefined);

  const selectedCompanyName = userInputCompanyName ?? typoCompanyNames[0]!;

  const handleSelectCompanyName = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (state.matches({ moveStarted: "selectingToMove" })) {
      setUserInputCompanyName(e.target.value);
      logger.info("selectingToMove");
      send({
        type: "SELECT_COMPANY_TYPO_NAME_TO_MOVE",
        // @ts-ignore
        payload: {
          companyTypoNameToMove: {
            correctCompanyNameFrom: correctCompanyName,
            typoCompanyNameToMove: e.target.value,
          },
        },
      });
      return;
    } else if (
      state.matches({
        moveStarted: {
          destinationSelecting: "selectingDestination",
        },
      })
    ) {
      logger.info("selectingDestination");
      send({
        type: "SELECT_COMPANY_TYPO_NAME_DESTINATION",
        // @ts-ignore
        payload: {
          destinationCompanyName: { correctCompanyName: e.target.value },
        },
      });
      return;
    }
  };

  // In here have the value that's being selected rn,
  // Then just pass that into the radio button and setSelectedTypoCompanyName

  logger.debug(state.value);

  console.log(state.value);

  const handleRadioButtonSelectCompanyName = () => {
    if (state.matches({ moveStarted: "selectingToMove" })) {
      logger.info("selectingToMove");
      send({
        type: "SELECT_COMPANY_TYPO_NAME_TO_MOVE",
        // @ts-ignore
        payload: {
          companyTypoNameToMove: {
            correctCompanyNameFrom: correctCompanyName,
            typoCompanyNameToMove: selectedCompanyName,
          },
        },
      });
      return;
    } else if (
      state.matches({
        moveStarted: {
          destinationSelecting: "selectingDestination",
        },
      })
    ) {
      logger.info("selectingDestination");
      send({
        type: "SELECT_COMPANY_TYPO_NAME_DESTINATION",
        // @ts-ignore
        payload: {
          destinationCompanyName: { correctCompanyName },
        },
      });
      return;
    }
  };

  const [textInputValue, setTextInputValue] = useState<string | undefined>(
    correctCompanyName
  );

  const handleInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInputValue(e.target.value);
    // const newCorrectCompanyName = e.target.value;
    // setLists((prev) => {
    //   const toChange: Row = pipe(
    //     prev,
    //     Object.values,
    //     A.findFirst((each) =>
    //       arrayEquals(each.typoCompanyNames, companyNameList)
    //     ),
    //     O.match(() => {
    //       throw new Error("No record found");
    //     }, identity)
    //   );

    //   const prevCorrectCompanyName = toChange.correctCompanyName;

    //   delete prev[prevCorrectCompanyName];

    //   toChange.correctCompanyName = newCorrectCompanyName;

    //   prev[newCorrectCompanyName] = toChange;
    //   logger.debug({ prev });
    // });
  };

  // if (companyNameList?.includes("ACSET AHM")) {
  //   logger.debug({ companyNameList });
  // }

  return (
    <Table.Row
      key={JSON.stringify(typoCompanyNames)}
      data-testid={`${correctCompanyName}-row`}
      className="bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      {state.matches("moveStarted") && (
        <Table.Cell className="w-4 p-4">
          <label
            className="sr-only"
            htmlFor={`${correctCompanyName}-radio-button`}
          >
            Select Company Name Radio Button
          </label>
          <Radio
            id={`${correctCompanyName}-radio-button`}
            name={`${correctCompanyName}-radio-button`}
            data-testid={`${correctCompanyName}-radio-button`}
            checked={checked}
            onChange={handleRadioButtonSelectCompanyName}
          />
        </Table.Cell>
      )}
      <Table.Cell className="font-medium text-gray-900 dark:text-white">
        <label className="sr-only" htmlFor={`${correctCompanyName}-dropdown`}>
          Correct Company Name Dropdown
        </label>
        <select
          id={`${correctCompanyName}-dropdown`}
          name={`${correctCompanyName}-dropdown`}
          data-testid={`${correctCompanyName}-dropdown`}
          onChange={handleSelectCompanyName}
        >
          {typoCompanyNames.map((companyName) => {
            return (
              <option
                disabled={state.matches({
                  moveStarted: { destinationSelecting: "selectedToMove" },
                })}
                key={companyName}
                value={companyName}
              >
                {companyName}
              </option>
            );
          })}
        </select>
      </Table.Cell>
      <Table.Cell>
        <TextInput value={textInputValue} onChange={handleInputValueChange} />
      </Table.Cell>
      <Table.Cell>
        {possibleCorrectCompanyNameFromPrevMonthStokAlat ?? ""}
      </Table.Cell>
    </Table.Row>
  );
};

export default GroupCompanyTypoNamesModalRow;
