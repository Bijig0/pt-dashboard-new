import { Button } from "flowbite-react";

type Props = {
  onClick: () => void;
};

const CreateManualTagihanButton = (props: Props) => {
  const { onClick } = props;
  return (
    <Button color="primary" onClick={onClick}>
      Create Manual Tagihan
    </Button>
  );
};

export default CreateManualTagihanButton;
