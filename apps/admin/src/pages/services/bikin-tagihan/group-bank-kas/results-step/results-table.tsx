import { FC } from "react";
import { Badge } from "flowbite-react";
import { ItemsSchema } from "../lib/types";

type Props = {
  sheetName: string;
  groupedItems: ItemsSchema;
  total: number;
};

export const ResultsTable: FC<Props> = ({ sheetName, groupedItems, total }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID").format(price);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {sheetName}
        </h3>
        <Badge color="success">{groupedItems.length} grouped items</Badge>
      </div>

      <div className="overflow-x-auto max-h-96">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 sticky top-0">
            <tr>
              <th className="px-4 py-3">KETERANGAN</th>
              <th className="px-4 py-3 text-right">KELUAR (Total)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {groupedItems.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-2">{item.itemName}</td>
                <td className="px-4 py-2 text-right font-mono">
                  {formatPrice(item.itemPrice)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-green-50 dark:bg-green-900/20">
            <tr>
              <td className="px-4 py-3 font-bold text-green-800 dark:text-green-300">
                Grand Total
              </td>
              <td className="px-4 py-3 text-right font-bold font-mono text-green-800 dark:text-green-300">
                {formatPrice(total)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
