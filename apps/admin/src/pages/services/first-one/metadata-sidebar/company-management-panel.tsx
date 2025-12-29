import { HiInformationCircle } from "react-icons/hi";
import RegisterCompany from "./register-company";
import RegisteredCompaniesList from "./registered-companies-list";

type CompanyManagementPanelProps = {
  companyNames: string[];
};

const CompanyManagementPanel = (props: CompanyManagementPanelProps) => {
  const { companyNames } = props;

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
      {/* Header with Info Icon */}
      <div className="mb-4 flex items-center gap-2">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Company Management
        </h3>
        <div className="group relative">
          <HiInformationCircle className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
          {/* Tooltip */}
          <div className="invisible group-hover:visible absolute left-0 top-6 z-50 w-64 rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-600 dark:bg-gray-700">
            <p className="text-xs text-gray-700 dark:text-gray-300">
              <strong>Company Management:</strong> Register new companies and view all registered companies.
              Only registered companies can be used in the Company Name column.
              Unregistered company names will be highlighted in yellow and prevent saving.
            </p>
          </div>
        </div>
      </div>

      {/* View Registered Companies */}
      <div className="mb-4">
        <RegisteredCompaniesList companyNames={companyNames} />
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-gray-300 dark:border-gray-600"></div>

      {/* Register Company */}
      <div>
        <RegisterCompany />
      </div>
    </div>
  );
};

export default CompanyManagementPanel;
