import logger from "@logger";
import { assign, setup } from "xstate";
import moveTypoCompanyNameToNew from "../../moveCompanyTypoNameToNew";
import moveTypoCompanyNameToDestinationRow from "./moveTypoCompanyNameToDestinationRow/moveTypoCompanyNameToDestinationRow";
import { ClusteredCompanyNames } from "./types";

export type CompanyTypoNameToMove = {
  correctCompanyNameFrom: string;
  typoCompanyNameToMove: string;
};

export type DestinationCompanyName = {
  correctCompanyName: string;
};

type Context = {
  clusteredCompanyNames: ClusteredCompanyNames;
  companyTypoNameToMove: CompanyTypoNameToMove | undefined;
  destinationCompanyName: DestinationCompanyName | undefined;
};

// Define the event types

// Define the action types

type Actions = {
  selectCompanyTypoNameToMove: (context: Context, event: Event) => void;
};

export const createGroupCompanyTypoNamesMachine = (initialContext: Context) => {
  return setup({
    types: {
      context: {} as Context,
      events: {} as
        | { type: "TOGGLE_START_MOVE" }
        | { type: "SELECT_COMPANY_TYPO_NAME_TO_MOVE" }
        | { type: "TOGGLE_COMPANY_TYPO_NAME_TO_MOVE_SELECTED" }
        | { type: "SELECT_COMPANY_TYPO_NAME_DESTINATION" }
        | { type: "TOGGLE_COMPANY_TYPO_NAME_DESTINATION_SELECTED" }
        | { type: "CONFIRM_MOVE_TYPO_NAME_TO_NEW" }
        | { type: "CONFIRM_MOVE_TYPO_NAME_TO_DESTINATION_ROW" }
        | { type: "START_MOVE_TO_NEW_DESTINATION" }
        | { type: "START_MOVE_TO_EXISTING_DESTINATION_ROW" },
    },
    actions: {
      selectCompanyTypoNameToMove: assign({
        companyTypoNameToMove: ({
          event: {
            // @ts-ignore
            payload: { companyTypoNameToMove },
          },
        }) => {
          logger.debug({ companyTypoNameToMove });
          console.log({ companyTypoNameToMove });
          return companyTypoNameToMove;
        },
      }),
      selectCompanyTypoNameDestination: assign({
        destinationCompanyName: ({
          event: {
            // @ts-ignore
            payload: { destinationCompanyName },
          },
        }) => {
          logger.debug({ destinationCompanyName });
          console.log({ destinationCompanyName });
          return destinationCompanyName;
        },
      }),
      moveTypoCompanyNameToDestination: assign({
        clusteredCompanyNames: ({ context }) => {
          const moved = moveTypoCompanyNameToDestinationRow(
            context.clusteredCompanyNames,
            context.companyTypoNameToMove!,
            context.destinationCompanyName!
          );
          logger.debug({ moved });
          return moved;
        },
      }),
      moveTypoCompanyNameToNew: assign({
        clusteredCompanyNames: ({ context }) => {
          const moved = moveTypoCompanyNameToNew(
            context.clusteredCompanyNames,
            context.companyTypoNameToMove!
          );
          logger.debug({ moved });
          console.log({ moved });
          return moved;
        },
      }),
      resetContext: assign({
        companyTypoNameToMove: () => undefined,
      }),
    },
  }).createMachine({
    context: initialContext,
    id: "move",
    initial: "idle",
    states: {
      idle: {
        on: {
          TOGGLE_START_MOVE: {
            target: "moveStarted",
          },
        },
        entry: "resetContext",
      },
      moveStarted: {
        initial: "selectingToMove",
        on: {
          TOGGLE_START_MOVE: {
            target: "idle",
          },
        },
        states: {
          selectingToMove: {
            on: {
              SELECT_COMPANY_TYPO_NAME_TO_MOVE: {
                target: "selectingToMove",
                actions: {
                  type: "selectCompanyTypoNameToMove",
                },
              },
              TOGGLE_COMPANY_TYPO_NAME_TO_MOVE_SELECTED: {
                target: "destinationSelecting",
              },
            },
          },
          destinationSelecting: {
            initial: "selectedToMove",
            on: {
              TOGGLE_COMPANY_TYPO_NAME_TO_MOVE_SELECTED: {
                target: "selectingToMove",
              },
            },
            states: {
              selectedToMove: {
                on: {
                  START_MOVE_TO_NEW_DESTINATION: {
                    target: "newDestinationSelected",
                  },
                  START_MOVE_TO_EXISTING_DESTINATION_ROW: {
                    target: "selectingDestination",
                  },
                },
              },
              newDestinationSelected: {
                on: {
                  CONFIRM_MOVE_TYPO_NAME_TO_NEW: {
                    target: "#move.moved",
                    actions: {
                      type: "moveTypoCompanyNameToNew",
                    },
                  },
                },
              },
              selectingDestination: {
                on: {
                  SELECT_COMPANY_TYPO_NAME_DESTINATION: {
                    target: "selectingDestination",
                    actions: {
                      type: "selectCompanyTypoNameDestination",
                    },
                  },
                  TOGGLE_COMPANY_TYPO_NAME_DESTINATION_SELECTED: {
                    target: "selectedDestination",
                  },
                },
              },
              selectedDestination: {
                on: {
                  CONFIRM_MOVE_TYPO_NAME_TO_DESTINATION_ROW: {
                    target: "#move.moved",
                    actions: {
                      type: "moveTypoCompanyNameToDestination",
                    },
                  },
                  TOGGLE_COMPANY_TYPO_NAME_DESTINATION_SELECTED: {
                    target: "selectingDestination",
                  },
                },
              },
            },
          },
        },
      },
      moved: {
        always: "idle",
      },
    },
  });
};
