import { useQuery } from "@tanstack/react-query";

type Args = {
  startDate: Date;
  endDate: Date;
};

const queryFn = async (args: Args) => {
  console.log({ startDate: args.startDate, endDate: args.endDate });
  return 1;
};
const useTestQuery = (args: Args) => {
  console.log({ args });

  const query = useQuery({
    queryKey: ["test", args.startDate, args.endDate],
    queryFn: () => queryFn(args),
  });

  return query;
};

export default useTestQuery;
