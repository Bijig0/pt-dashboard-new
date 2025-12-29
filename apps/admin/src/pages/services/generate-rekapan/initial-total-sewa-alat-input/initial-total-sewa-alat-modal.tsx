import { Alert, Button, Label, Modal, TextInput } from "flowbite-react";
import { useState, useMemo } from "react";
import { HiCheck, HiInformationCircle, HiSearch } from "react-icons/hi";
import { LoadingSpinner } from "../../../../context/ToastContext";
import { useLocale } from "../../../../context/LocaleContext";
import useGetCurrentMonthStokAlatData from "../../../../hooks/useGetCurrentMonthStokAlatData";
import { InitialTotalSewaAlat } from "../../first-one/grid/handleGenerateRekapan/buildInitialRekapanFromValues/buildInitialRekapanFromValues";

type InitialTotalSewaAlatModalProps = {
  startDate: Date | undefined;
  initialValues: InitialTotalSewaAlat;
  onChange: (values: InitialTotalSewaAlat) => void;
  isOpen: boolean;
  onClose: () => void;
};

const InitialTotalSewaAlatModal = (props: InitialTotalSewaAlatModalProps) => {
  const { startDate, initialValues, onChange, isOpen, onClose } = props;
  const { t } = useLocale();
  const [companySearchQuery, setCompanySearchQuery] = useState("");
  const [alatSearchQuery, setAlatSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [markedAsDone, setMarkedAsDone] = useState<Set<string>>(new Set());

  // Fetch stok alat data for the selected month
  const {
    data: stokAlatData,
    isLoading: isLoadingStokAlat,
    error: stokAlatError,
  } = useGetCurrentMonthStokAlatData(startDate);

  // Derive company-alat map from stok alat data
  const companyAlatMap = useMemo(() => {
    if (!stokAlatData) return {};

    const map: Record<string, Set<string>> = {};
    for (const record of stokAlatData) {
      const company = record.company_name.name;
      const alat = record.alat_name.name;
      if (!map[company]) map[company] = new Set();
      map[company].add(alat);
    }

    // Convert Sets to sorted arrays
    return Object.fromEntries(
      Object.entries(map).map(([company, alatSet]) => [
        company,
        [...alatSet].sort(),
      ])
    );
  }, [stokAlatData]);

  // Get company names from the map (sorted)
  const companyNames = useMemo(() => {
    return Object.keys(companyAlatMap).sort();
  }, [companyAlatMap]);

  // Get alat names for the selected company
  const selectedCompanyAlats = useMemo(() => {
    if (!selectedCompany) return [];
    return companyAlatMap[selectedCompany] ?? [];
  }, [selectedCompany, companyAlatMap]);

  // Filter companies by search query
  const filteredCompanies = useMemo(() => {
    if (!companySearchQuery.trim()) return companyNames;
    return companyNames.filter((name) =>
      name.toLowerCase().includes(companySearchQuery.toLowerCase())
    );
  }, [companyNames, companySearchQuery]);

  // Filter alats by search query
  const filteredAlatNames = useMemo(() => {
    if (!alatSearchQuery.trim()) return selectedCompanyAlats;
    return selectedCompanyAlats.filter((name) =>
      name.toLowerCase().includes(alatSearchQuery.toLowerCase())
    );
  }, [selectedCompanyAlats, alatSearchQuery]);

  // Early return AFTER all hooks
  if (!startDate) {
    return null;
  }

  const handleValueChange = (alatName: string, value: string) => {
    if (!selectedCompany) return;

    // Filter out non-numeric characters, allow empty string
    const filteredValue = value.replace(/[^0-9]/g, "");
    const numericValue = filteredValue === "" ? 0 : parseInt(filteredValue);

    onChange({
      ...initialValues,
      [selectedCompany]: {
        ...(initialValues[selectedCompany] ?? {}),
        [alatName]: numericValue,
      },
    });
  };

  // Display value: show empty string for 0 to allow easy clearing
  const getDisplayValue = (alatName: string): string => {
    if (!selectedCompany) return "";
    const value = initialValues[selectedCompany]?.[alatName];
    if (value === undefined || value === 0) return "";
    return String(value);
  };

  const handleToggleMarkAsDone = () => {
    if (!selectedCompany) return;
    setMarkedAsDone((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(selectedCompany)) {
        newSet.delete(selectedCompany);
      } else {
        newSet.add(selectedCompany);
      }
      return newSet;
    });
  };

  const handleSelectCompany = (companyName: string) => {
    setSelectedCompany(companyName);
    setAlatSearchQuery(""); // Reset alat search when switching companies
  };

  const isCompanyMarkedDone = (companyName: string) =>
    markedAsDone.has(companyName);

  return (
    <Modal show={isOpen} onClose={onClose} size="6xl">
      <Modal.Header>
        {t.generateRekapan.initialTotalSewaAlat.modalTitle}
      </Modal.Header>
      <div className="flex" style={{ maxHeight: "80vh" }}>
        {/* Left panel: Company selector */}
        <div className="flex w-72 flex-shrink-0 flex-col border-r border-gray-200 dark:border-gray-700">
          {/* Company search */}
          <div className="border-b border-gray-200 p-4 dark:border-gray-700">
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Pilih Perusahaan
            </p>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <HiSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 pl-9 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="Cari perusahaan..."
                value={companySearchQuery}
                onChange={(e) => setCompanySearchQuery(e.target.value)}
              />
            </div>
            {companyNames.length > 0 && (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {markedAsDone.size} dari {companyNames.length} selesai
              </p>
            )}
          </div>

          {/* Company list */}
          <div className="flex-1 overflow-y-auto">
            {isLoadingStokAlat && (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
              </div>
            )}

            {stokAlatError && (
              <div className="p-4">
                <Alert color="failure" icon={HiInformationCircle}>
                  <p className="text-sm">Error loading stok alat data</p>
                </Alert>
              </div>
            )}

            {!isLoadingStokAlat && !stokAlatError && (
              <div className="py-1">
                {filteredCompanies.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    Tidak ada perusahaan ditemukan
                  </p>
                ) : (
                  filteredCompanies.map((companyName) => (
                    <button
                      key={companyName}
                      onClick={() => handleSelectCompany(companyName)}
                      className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
                        selectedCompany === companyName
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                    >
                      <span className="w-5 flex-shrink-0">
                        {isCompanyMarkedDone(companyName) && (
                          <HiCheck className="h-5 w-5 text-green-500" />
                        )}
                      </span>
                      <span className="truncate">{companyName}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right panel: Alat inputs */}
        <div className="flex flex-1 flex-col">
          {!selectedCompany ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Pilih perusahaan dari daftar di sebelah kiri
                </p>
                <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                  untuk mengatur nilai awal Total Sewa Alat
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Header with company name and mark as done */}
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Mengatur nilai untuk:
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedCompany}
                  </h3>
                </div>
                <Button
                  color={isCompanyMarkedDone(selectedCompany) ? "success" : "light"}
                  size="sm"
                  onClick={handleToggleMarkAsDone}
                >
                  <HiCheck className="mr-2 h-4 w-4" />
                  {isCompanyMarkedDone(selectedCompany) ? "Batalkan Selesai" : "Tandai Selesai"}
                </Button>
              </div>

              {/* Alat search */}
              <div className="border-b border-gray-200 px-6 py-3 dark:border-gray-700">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <HiSearch className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 pl-9 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      placeholder="Cari nama alat..."
                      value={alatSearchQuery}
                      onChange={(e) => setAlatSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {alatSearchQuery
                      ? `${filteredAlatNames.length} dari ${selectedCompanyAlats.length} alat`
                      : `${selectedCompanyAlats.length} alat`}
                  </div>
                </div>
              </div>

              {/* Alat inputs grid */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {selectedCompanyAlats.length === 0 && (
                  <Alert color="warning" icon={HiInformationCircle}>
                    <p className="text-sm">
                      {t.generateRekapan.initialTotalSewaAlat.noData}
                    </p>
                  </Alert>
                )}

                {selectedCompanyAlats.length > 0 && (
                    <>
                      {filteredAlatNames.length === 0 ? (
                        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                          Tidak ada alat yang cocok dengan "{alatSearchQuery}"
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {filteredAlatNames.map((alatName) => (
                            <div
                              key={alatName}
                              className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
                            >
                              <Label
                                htmlFor={`initial-${selectedCompany}-${alatName}`}
                                value={alatName}
                                className="mb-2 block text-sm font-medium"
                              />
                              <TextInput
                                id={`initial-${selectedCompany}-${alatName}`}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={getDisplayValue(alatName)}
                                onChange={(e) =>
                                  handleValueChange(alatName, e.target.value)
                                }
                                placeholder="0"
                                sizing="sm"
                              />
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Nilai:{" "}
                                {initialValues[selectedCompany]?.[alatName] ?? 0}{" "}
                                unit
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-700">
        <div className="rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-800">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <strong>{t.generateRekapan.initialTotalSewaAlat.note}</strong>{" "}
            {t.generateRekapan.initialTotalSewaAlat.noteText}
          </p>
        </div>
        <Button onClick={onClose}>{t.common.close}</Button>
      </div>
    </Modal>
  );
};

export default InitialTotalSewaAlatModal;
