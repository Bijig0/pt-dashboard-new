import { Button, Modal } from "flowbite-react";
import { FC, useState } from "react";
import { HiInformationCircle } from "react-icons/hi";

export const FormatInfoModal: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button color="light" size="sm" onClick={() => setIsOpen(true)}>
        <HiInformationCircle className="mr-2 h-5 w-5" />
        Show Format Guide
      </Button>

      <Modal show={isOpen} onClose={() => setIsOpen(false)}>
        <Modal.Header>Bank KAS Excel File Format Guide</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                Required Columns (in order)
              </h3>
              <ol className="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300">
                <li>
                  <strong>TGL</strong> - Date column (must be the header)
                </li>
                <li>
                  <strong>KETERANGAN</strong> - Description/Item name (will be
                  grouped)
                </li>
                <li>
                  <strong>KELUAR</strong> - Amount to sum
                </li>
              </ol>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                Example Data
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
                  <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2">TGL</th>
                      <th className="px-4 py-2">KETERANGAN</th>
                      <th className="px-4 py-2">KELUAR</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b dark:border-gray-700">
                      <td className="px-4 py-2">2025-01-15</td>
                      <td className="px-4 py-2">Internet</td>
                      <td className="px-4 py-2">50000</td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <td className="px-4 py-2">2025-01-16</td>
                      <td className="px-4 py-2">Office Supplies</td>
                      <td className="px-4 py-2">25000</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">2025-01-17</td>
                      <td className="px-4 py-2">Internet</td>
                      <td className="px-4 py-2">50000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                After grouping: Internet = 100,000 (50,000 + 50,000)
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                Common Errors to Avoid
              </h3>
              <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Missing TGL header row
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Empty rows between data
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Formula cells without values
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Non-numeric values in KELUAR column
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                The Tool Will:
              </h3>
              <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Remove rows before TGL header
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Remove blank rows
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Group by KETERANGAN
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Sum KELUAR values
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Sort alphabetically
                </li>
              </ul>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setIsOpen(false)}>Got it!</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
