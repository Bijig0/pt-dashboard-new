import logger from "@logger";
import { useSelector } from "@xstate/react";
import { Badge, Radio, Table, TextInput } from "flowbite-react";
import { identity } from "fp-ts/lib/function";
import { useState } from "react";
import { HiCheckCircle } from "react-icons/hi";
import { ActorRefFrom } from "xstate";
import { useLocale } from "../../../../../../context/LocaleContext";
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
  showAdvancedMode: boolean;
};

const GroupCompanyTypoNamesModalRow = (props: Props) => {
  const { t } = useLocale();
  const {
    actorRef,
    typoCompanyNames,
    correctCompanyName,
    possibleCorrectCompanyNameFromPrevMonthStokAlat,
    showAdvancedMode,
  } = props;
  const state = useSelector(actorRef, identity);
  const send = actorRef.send;

  const [userInputCompanyName, setUserInputCompanyName] = useState<
    string | undefined
  >(undefined);
  const [textInputValue, setTextInputValue] = useState<string>(
    correctCompanyName
  );

  const selectedCompanyName = userInputCompanyName ?? typoCompanyNames[0]!;

  const checked =
    typoCompanyNames.includes(
      // @ts-ignore
      state.context.companyTypoNameToMove?.typoCompanyNameToMove
    ) ||
    typoCompanyNames.includes(
      // @ts-ignore
      state.context.destinationCompanyName?.correctCompanyName
    );

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

  const handleInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInputValue(e.target.value);
  };

  const hasSuggestion =
    possibleCorrectCompanyNameFromPrevMonthStokAlat !== undefined;

  return (
    <Table.Row
      key={JSON.stringify(typoCompanyNames)}
      data-testid={`${correctCompanyName}-row`}
      className={`bg-white dark:border-gray-700 dark:bg-gray-800 ${
        checked ? "bg-blue-50 dark:bg-blue-900/20" : ""
      }`}
    >
      {showAdvancedMode && state.matches("moveStarted") && (
        <Table.Cell className="w-16 p-4">
          <Radio
            id={`${correctCompanyName}-radio-button`}
            name={`${correctCompanyName}-radio-button`}
            data-testid={`${correctCompanyName}-radio-button`}
            checked={checked}
            onChange={handleRadioButtonSelectCompanyName}
          />
        </Table.Cell>
      )}

      {/* Name Variations Column */}
      <Table.Cell className="font-medium text-gray-900 dark:text-white">
        <div className="space-y-2">
          {/* Show dropdown if in move mode, otherwise show as badges */}
          {showAdvancedMode && state.matches("moveStarted") ? (
            <select
              id={`${correctCompanyName}-dropdown`}
              name={`${correctCompanyName}-dropdown`}
              data-testid={`${correctCompanyName}-dropdown`}
              onChange={handleSelectCompanyName}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
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
          ) : (
            <div className="flex flex-wrap gap-2">
              {typoCompanyNames.map((name, idx) => (
                <Badge key={idx} color="gray" size="sm">
                  {name}
                </Badge>
              ))}
              {typoCompanyNames.length > 1 && (
                <Badge color="info" size="sm">
                  {typoCompanyNames.length} {t.companyTypoGrouping.table.variations}
                </Badge>
              )}
            </div>
          )}
        </div>
      </Table.Cell>

      {/* Standardized Name Column */}
      <Table.Cell>
        <TextInput
          value={textInputValue}
          onChange={handleInputValueChange}
          placeholder={t.companyTypoGrouping.table.standardizedName}
          sizing="sm"
        />
      </Table.Cell>

      {/* Previous Month Suggestion Column */}
      <Table.Cell>
        {hasSuggestion ? (
          <div className="flex items-center gap-2">
            <HiCheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">
              {possibleCorrectCompanyNameFromPrevMonthStokAlat}
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-400 dark:text-gray-500">
            {t.companyTypoGrouping.table.noSuggestion}
          </span>
        )}
      </Table.Cell>
    </Table.Row>
  );
};

export default GroupCompanyTypoNamesModalRow;
