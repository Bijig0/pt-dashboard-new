import { Label, TextInput } from "flowbite-react";
import React from "react";
import { Control, Controller, UseFormSetValue } from "react-hook-form";
import { getHarianHargaSewa } from "../../../../../../../../helpers/createTagihan/convertTagihanJSToWorkbook/createHargaSewaToDisplay/getHarianHargaSewa/getHarianHargaSewa";
import { useRekapanContext } from "../../../../../rekapan-provider";
import { useGenerateTagihanStore } from "../../../../store";

type Props = {
  alat: {
    name: string;
  };
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  index: number;
};

export const AlatRowInputPrice: React.FC<Props> = (props) => {
  const { alat, control, index, setValue } = props;
  const { daysInPeriod } = useRekapanContext();
  const { updateAllHargas, updateHargaHarian } = useGenerateTagihanStore();

  const handleUpdateHargaBulananAdditionals = ({
    hargaBulanan,
  }: {
    hargaBulanan: number;
  }) => {
    const hargaHarian = getHarianHargaSewa(hargaBulanan, daysInPeriod);
    const updateHargaHarian = () => {
      setValue(`hargas.${index}.hargaHarian`, hargaHarian);
    };

    updateHargaHarian();

    updateAllHargas({
      [alat.name]: {
        alatName: alat.name,
        hargaBulanan: hargaBulanan,
        hargaHarian: hargaHarian,
      },
    });
  };

  const handleUpdateHargaHarianAdditionals = ({
    hargaHarian,
  }: {
    hargaHarian: number;
  }) => {
    updateHargaHarian({
      alatName: alat.name,
      hargaHarian: hargaHarian,
    });
  };

  return (
    <div>
      <div
        role="row"
        key={alat.name}
        className="bg-white dark:border-gray-700 dark:bg-gray-800 flex gap-4 items-center justify-between"
      >
        <p className="font-medium text-gray-900 dark:text-white px-6 py-4">
          {alat.name}
        </p>
        <Controller
          control={control}
          name={`hargas.${index}.hargaBulanan`}
          render={({ field }) => (
            <div>
              <Label
                htmlFor={`hargas.${index}.hargaBulanan`}
                className="sr-only"
              >
                Harga Bulanan
              </Label>
              <TextInput
                id={`hargas.${index}.hargaBulanan`}
                required
                type="number"
                placeholder="Enter harga bulanan"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value)) {
                    handleUpdateHargaBulananAdditionals({
                      hargaBulanan: value,
                    });
                  }
                }}
              />
            </div>
          )}
        />
        <Controller
          control={control}
          name={`hargas.${index}.hargaHarian`}
          render={({ field }) => (
            <div>
              <Label
                htmlFor={`hargas.${index}.hargaHarian`}
                className="sr-only"
              >
                Harga Harian
              </Label>
              <TextInput
                id={`hargas.${index}.hargaHarian`}
                required
                type="number"
                placeholder="Enter harga harian"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  const value = parseFloat(e.target.value);
                  handleUpdateHargaHarianAdditionals({ hargaHarian: value });
                }}
              />
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default AlatRowInputPrice;
