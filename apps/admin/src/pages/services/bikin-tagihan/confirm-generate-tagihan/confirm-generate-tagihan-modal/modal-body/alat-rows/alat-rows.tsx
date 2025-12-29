import { Table } from "flowbite-react";
import { AlatRow } from "./alat-row/alat-row";

export type AlatData = {
  hargaBulanan: number;
  hargaHarian: number;
  name: string;
};

type Props = {
  items: AlatData[];
};

const AlatRows = (props: Props) => {
  const { items } = props;
  return (
    <Table hoverable>
      {items.map((item) => {
        return <AlatRow key={item.name} alat={item} />;
      })}
    </Table>
  );
};

export default AlatRows;
