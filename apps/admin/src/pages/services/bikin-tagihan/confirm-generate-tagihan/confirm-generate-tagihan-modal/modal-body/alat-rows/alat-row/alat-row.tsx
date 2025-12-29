import { Table } from "flowbite-react";

type Props = {
  alat: {
    name: string;
    hargaBulanan: number;
    hargaHarian: number;
  };
};

export const AlatRow = (props: Props) => {
  const { alat } = props;
  return (
    <Table.Row
      role="row"
      key={alat.name}
      className="bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <Table.Cell
        role="cell"
        className="font-medium text-gray-900 dark:text-white"
      >
        {alat.name}
      </Table.Cell>
      <Table.Cell role="cell">{alat.hargaBulanan}</Table.Cell>
      <Table.Cell role="cell">{alat.hargaHarian}</Table.Cell>
    </Table.Row>
  );
};
