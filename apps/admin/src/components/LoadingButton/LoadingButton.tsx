import { Button } from "flowbite-react";
import { ComponentProps } from "react";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";

type Props = {
  isLoading: boolean;
  children: React.ReactNode;
} & ComponentProps<typeof Button>;

const LoadingButton = (props: Props) => {
  const { isLoading, children, ...buttonProps } = props;

  return (
    <Button disabled={isLoading} {...buttonProps}>
      {isLoading ? <LoadingSpinner /> : children}
    </Button>
  );
};

export default LoadingButton;
