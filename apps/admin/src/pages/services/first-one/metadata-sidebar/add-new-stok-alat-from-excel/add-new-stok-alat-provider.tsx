import { createContext, SetStateAction, useContext, useState } from "react";

type ContextType = {
  files: File[];
  setFiles: React.Dispatch<SetStateAction<File[]>>;
};

const AddNewStokAlatContext = createContext<ContextType>({} as ContextType);

export const AddNewStokAlatProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  

  return (
    <AddNewStokAlatContext.Provider
      value={{
        files,
        setFiles,
      }}
    >
      {children}
    </AddNewStokAlatContext.Provider>
  );
};

export default AddNewStokAlatProvider;

export const useAddNewStokAlatContext = () => useContext(AddNewStokAlatContext);
