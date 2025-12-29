import { Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import { HiInformationCircle, HiSearch } from "react-icons/hi";
import RegisterCompany from "./register-company";
import RegisteredCompaniesList from "./registered-companies-list";

type CompanyNameManagementModalProps = {
  show: boolean;
  onClose: () => void;
  companyNames: string[];
};

const CompanyNameManagementModal = (props: CompanyNameManagementModalProps) => {
  const { show, onClose, companyNames } = props;
  const [searchQuery, setSearchQuery] = useState("");

  // Filter companies based on search query
  const filteredCompanies = searchQuery
    ? companyNames.filter((name) =>
        name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : companyNames;

  return (
    <Modal dismissible show={show} onClose={onClose} size="2xl">
      <Modal.Header>
        <div className="flex items-center gap-2">
          <span>Company Name Management</span>
          <div className="group relative">
            <HiInformationCircle className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
            {/* Tooltip */}
            <div className="invisible group-hover:visible absolute left-0 top-6 z-50 w-64 rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-600 dark:bg-gray-700">
              <div className="mb-2 rounded bg-yellow-100 p-2 dark:bg-yellow-900/30">
                <p className="text-xs font-bold text-yellow-900 dark:text-yellow-200">
                  THIS IS TO PREVENT TYPOS IN COMPANY NAME COLUMN
                </p>
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300">
                <strong>Company Name Management:</strong> Register new companies
                and manage existing ones. Only registered companies can be used in
                the Company Name column. Unregistered company names will be
                highlighted in yellow and prevent saving.
              </p>
            </div>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          {/* Search Field */}
          <div>
            <TextInput
              icon={HiSearch}
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* View Registered Companies */}
          <div>
            <RegisteredCompaniesList
              companyNames={filteredCompanies}
              searchQuery={searchQuery}
              totalCount={companyNames.length}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-300 dark:border-gray-600"></div>

          {/* Register Company */}
          <div>
            <RegisterCompany />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CompanyNameManagementModal;
