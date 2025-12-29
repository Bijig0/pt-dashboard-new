import { useLocale } from "../../../../context/LocaleContext";
import { ExampleRekapanData } from "./data/types";

type Props = {
  data: ExampleRekapanData;
};

export const ExampleGenerateRekapanViewer = ({ data }: Props) => {
  const { t } = useLocale();

  if (data.rows.length === 0) {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 min-h-[400px]">
          <span className="text-gray-400 dark:text-gray-500 italic">No rekapan data available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="p-3 bg-gray-50 dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">{t.generateRekapan.exampleModal.date}</th>
                {data.equipmentNames.map((name) => (
                  <th key={name} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-center">
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, index) => (
                <tr
                  key={index}
                  className={`${
                    row.isSummaryRow
                      ? "bg-blue-50 dark:bg-blue-900/20 font-semibold"
                      : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 whitespace-nowrap">
                    {row.tanggal}
                  </td>
                  {data.equipmentNames.map((name) => {
                    const quantity = row.equipmentQuantities[name];
                    return (
                      <td key={name} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-center">
                        {quantity !== undefined ? (
                          <span
                            className={
                              row.isSummaryRow
                                ? "text-blue-700 dark:text-blue-300 font-medium"
                                : quantity < 0
                                ? "text-red-600 dark:text-red-400"
                                : quantity > 0
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-900 dark:text-gray-100"
                            }
                          >
                            {quantity}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
