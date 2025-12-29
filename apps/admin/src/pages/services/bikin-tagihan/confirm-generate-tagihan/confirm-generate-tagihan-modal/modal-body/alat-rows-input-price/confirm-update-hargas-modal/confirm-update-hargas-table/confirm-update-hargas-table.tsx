import { Table } from "flowbite-react";
import { AlatData } from "../../../modal-body";

type Props = {
  alatData: AlatData[];
};

export const ConfirmModalTable = (props: Props) => {
  const { alatData } = props;

  return (
    <div className="overflow-x-auto">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell role="cell">Nama Alat</Table.HeadCell>
          <Table.HeadCell role="cell">Harga Bulanan</Table.HeadCell>
          <Table.HeadCell role="cell">Harga Harian</Table.HeadCell>
        </Table.Head>
        <div className="divide-y">
          {alatData.map((alat) => {
            return (
              <Table.Row
                key={alat.alatName}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Table.Cell
                  role="cell"
                  className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white"
                >
                  {alat.alatName}
                </Table.Cell>
                <Table.Cell
                  role="cell"
                  className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400"
                >
                  {alat.hargaBulanan}
                </Table.Cell>
                <Table.Cell
                  role="cell"
                  className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400"
                >
                  {alat.hargaHarian}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </div>
      </Table>
    </div>
  );
};
