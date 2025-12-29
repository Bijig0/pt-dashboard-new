import { createContext, SetStateAction, useContext, useState } from "react";
import { AlatData } from "./input-alat-prices/alat-price-modal";

type ContextType = {
  files: File[];
  setFiles: React.Dispatch<SetStateAction<File[]>>;
  // rekapanData: any;
  // setRekapanData: React.Dispatch<SetStateAction<any>>;
  alatPrices: AlatData[];
  setAlatPrices: React.Dispatch<SetStateAction<AlatData[]>>;
  // alatNames: string[];
  // setAlatNames: React.Dispatch<SetStateAction<string[]>>;
};

const CreateManualTagihanContext = createContext<ContextType>(
  {} as ContextType
);

export const CreateManualTagihanProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [alatPrices, setAlatPrices] = useState<AlatData[]>([]);

  // console.log({ alatNames });

  return (
    <CreateManualTagihanContext.Provider
      value={{
        files,
        setFiles,
        // rekapanData,
        // setRekapanData,
        // alatNames,
        // setAlatNames,
        alatPrices,
        setAlatPrices,
      }}
    >
      {children}
    </CreateManualTagihanContext.Provider>
  );
};

export default CreateManualTagihanProvider;

export const useCreateManualTagihanContext = () =>
  useContext(CreateManualTagihanContext);
