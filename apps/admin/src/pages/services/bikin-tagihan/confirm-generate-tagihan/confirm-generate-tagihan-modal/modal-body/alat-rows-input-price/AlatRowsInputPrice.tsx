import React, { useEffect } from "react";
import { useFieldArray, useForm, UseFormSetValue } from "react-hook-form";
import { useBoolean } from "usehooks-ts";
import { useGenerateTagihanStore } from "../../../store";
import { AlatData } from "../modal-body";
import AlatRowInputPrice from "./alat-row-input-price/AlatRowInputPrice";
import { convertAllHargasToRows } from "./convertAllHargasToRows/convertAllHargasToRows";
import { UpdateHargasButton } from "./update-hargas-button/update-hargas-button";

type Props = {
  alatNames: string[];
};

export const AlatRowsInputPrice: React.FC<Props> = ({ alatNames }) => {
  const { control, handleSubmit, setValue } = useForm<{
    hargas: AlatData[];
  }>();

  const { allHargas, allHargasAsRows } = useGenerateTagihanStore((state) => ({
    allHargas: state.allHargas,
    allHargasAsRows: convertAllHargasToRows(state.allHargas),
  }));

  console.log({ allHargas });

  const { fields, replace } = useFieldArray({
    control,
    name: "hargas",
  });

  useEffect(() => {
    const currentHargas = alatNames.map(
      (name) =>
        allHargas[name] || {
          alatName: name,
          hargaBulanan: null,
          hargaHarian: null,
        }
    );
    replace(currentHargas as AlatData[]);
    // TODO: initial data should go ehre too, but if I do it then it'll re-render on every input which causes
    // the refoocus issue
    // Find the diff between this and alat names so I can add the initial dat but just put in a check
    // in the useEffect to see if it's allowed or not
  }, [alatNames, replace]);

  const {
    value: showModal,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean(false);

  const handleFormSubmit = (data: { hargas: AlatData[] }) => {
    // onSubmit(data.hargas);
    replace(data.hargas);
    openModal();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      {fields.map((field, index) => (
        <AlatRowInputPrice
          key={field.id}
          alat={{ name: field.alatName }}
          control={control}
          setValue={setValue as UseFormSetValue<any>}
          index={index}
        />
      ))}
      <UpdateHargasButton
        showButton={alatNames.length > 0}
        showModal={showModal}
        closeModal={closeModal}
        openModal={openModal}
        alatData={allHargasAsRows}
      />
    </form>
  );
};

export default AlatRowsInputPrice;
