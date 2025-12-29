import { Modal } from "flowbite-react";
import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import { AlatDataRow } from "../getPricesCategorizedByPresence/convertCategorizedPricesIntoRows/convertCategorizedPricesIntoRows";
import { AlatRowsInputPrice } from "./alat-rows-input-price/AlatRowsInputPrice";
import AlatRows from "./alat-rows/alat-rows";

type Props = {
  items: AlatDataRow[];
  itemsPerPage: number;
};

export type AlatData = {
  alatName: string;
  hargaBulanan: number;
  hargaHarian: number;
};

export const ModalBody: React.FC<Props> = ({ items, itemsPerPage }) => {
  const [itemOffset, setItemOffset] = useState(0);

  const missingItems = items.filter((item) => item.status === "missing");
  const presentItems = items.filter((item) => item.status === "present");
  const sortedItems = [...missingItems, ...presentItems];

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = sortedItems.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(sortedItems.length / itemsPerPage);

  const visibleMissingItems = currentItems
    .filter((item) => item.status === "missing")
    .map((item) => item.name);
  const visiblePresentItems = currentItems.filter(
    (item) => item.status === "present"
  );

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % sortedItems.length;
    setItemOffset(newOffset);
  };

  return (
    <Modal.Body className="pb-0">
      <div className="grid grid-cols-1">
        <div className="flex justify-between px-4">
          <h3>Nama Alat</h3>
          <h3>Harga Bulanan</h3>
          <h3>Harga Harian</h3>
        </div>
        <AlatRowsInputPrice alatNames={visibleMissingItems} />
        <AlatRows items={visiblePresentItems} />
        <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="<"
          renderOnZeroPageCount={null}
          containerClassName="flex gap-2"
        />
      </div>
    </Modal.Body>
  );
};

export default ModalBody;
