import { useQuery } from "@tanstack/react-query";

const TestComponent = () => {
  const query = useQuery({
    queryKey: ["test"],
    queryFn: () => {
      return Promise.resolve(1);
    },
  });

  if (query.data) {
    return <div>Data</div>;
  }

  if (query.isLoading) {
    return <div>Hello</div>;
  }

  return <div>Error</div>;
};

export default TestComponent;
