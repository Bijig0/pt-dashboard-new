type Args = {
  rows: string[][];
};

export const sortCliInputs = ({ rows }: Args) => {
  return rows.map((cluster) =>
    cluster.sort((a, b) => parseInt(a, 10) - parseInt(b, 10)),
  );
};
