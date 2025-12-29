import { useState } from "react";
import { HiTable } from "react-icons/hi";
import { useLocale } from "../../../../context/LocaleContext";
import { ExampleStokAlatData } from "./data/types";

type Props = {
  examples: ExampleStokAlatData[];
};

export const ExampleStokAlatViewer = ({ examples }: Props) => {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<number>(0);

  const currentExample = examples[activeTab];

  if (!currentExample) {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 min-h-[400px]">
          <span className="text-gray-400 dark:text-gray-500 italic">No examples available</span>
        </div>
      </div>
    );
  }

  const renderTable = () => (
    <div className="p-3 bg-gray-50 dark:bg-gray-800">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">{t.generateRekapan.exampleModal.date}</th>
              <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">{t.generateRekapan.exampleModal.company}</th>
              <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">{t.generateRekapan.exampleModal.in}</th>
              <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">{t.generateRekapan.exampleModal.out}</th>
            </tr>
          </thead>
          <tbody>
            {currentExample.records.length === 0 ? (
              <tr className="bg-white dark:bg-gray-800">
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-600" colSpan={4}>
                  <span className="text-gray-400 dark:text-gray-500 italic">No data available</span>
                </td>
              </tr>
            ) : (
              currentExample.records.map((record, index) => (
                <tr key={index} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 whitespace-nowrap">
                    {record.tanggal}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">
                    {record.company_name}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-center">
                    {record.masuk !== null ? (
                      <span className="text-green-600 dark:text-green-400 font-medium">{record.masuk}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-center">
                    {record.keluar !== null ? (
                      <span className="text-red-600 dark:text-red-400 font-medium">{record.keluar}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === index
                ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <HiTable className="h-4 w-4" />
            {example.title}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTable()}
    </div>
  );
};
