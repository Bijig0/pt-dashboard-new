import { Button } from "flowbite-react";
import { SetStateAction } from "react";

type Props = {
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
};

export const ConfirmGenerateTagihanButton = (props: Props) => {
  const { setIsOpen } = props;
  return (
    <Button color="primary" onClick={() => setIsOpen(true)}>
      Confirm Generate Tagihan
    </Button>
  );
};
