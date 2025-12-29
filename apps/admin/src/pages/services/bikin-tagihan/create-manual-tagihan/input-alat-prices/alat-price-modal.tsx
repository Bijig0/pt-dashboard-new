import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import { useWizard } from "react-use-wizard";
import AlatRowsInputPrice from "../../confirm-generate-tagihan/confirm-generate-tagihan-modal/modal-body/alat-rows-input-price/AlatRowsInputPrice";

type Props = {
  alatNames: string[];
  itemsPerPage: number;
};

export type AlatData = {
  alatName: string;
  hargaBulanan: number;
  hargaHarian: number;
};

export const InputAlatPrices = ({ alatNames, itemsPerPage }: Props) => {
  const [itemOffset, setItemOffset] = useState(0);

  const { nextStep } = useWizard();

  console.log({ alatNames });

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = alatNames.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(alatNames.length / itemsPerPage);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % alatNames.length;
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
        <AlatRowsInputPrice alatNames={currentItems} />
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
      <Button color="primary" onClick={nextStep}>
        Next Step
      </Button>
    </Modal.Body>
  );
};

export default InputAlatPrices;
