// create a context template for me

import { SetStateAction, createContext, useContext, useState } from "react";

type ContextType = {
  startRekapanCreationDate: Date | undefined;
  setStartRekapanCreationDate: React.Dispatch<SetStateAction<Date | undefined>>;
  endRekapanCreationDate: Date | undefined;
  setEndRekapanCreationDate: React.Dispatch<SetStateAction<Date | undefined>>;
  isAnyDateSelectedForStartRekapanCreation: boolean;
  isAnyDateSelectedForEndRekapanCreation: boolean;
};

const FirstOneContext = createContext<ContextType>({} as ContextType);

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [startRekapanCreationDate, setStartRekapanCreationDate] = useState<
    Date | undefined
  >(undefined);

  const [endRekapanCreationDate, setEndRekapanCreationDate] = useState<
    Date | undefined
  >(undefined);

  const isAnyDateSelectedForStartRekapanCreation =
    startRekapanCreationDate !== undefined;

  const isAnyDateSelectedForEndRekapanCreation =
    endRekapanCreationDate !== undefined;

  return (
    <FirstOneContext.Provider
      value={{
        endRekapanCreationDate,
        setEndRekapanCreationDate,
        startRekapanCreationDate,
        setStartRekapanCreationDate,
        isAnyDateSelectedForStartRekapanCreation,
        isAnyDateSelectedForEndRekapanCreation,
      }}
    >
      {children}
    </FirstOneContext.Provider>
  );
};

export default Provider;

export const useFirstOneContext = () => useContext(FirstOneContext);
