import { useState } from "react";
import { Button, Modal, TextInput, Label, Badge } from "flowbite-react";
import { HiCalendar, HiPencil, HiPlus, HiTrash } from "react-icons/hi";
import dayjs from "dayjs";
import {
  addCustomDate,
  getCustomDates,
  removeCustomDate,
  updateCustomDate,
} from "../../../getEndOfMonths";

type DateManagementPanelProps = {
  onDatesChanged: () => void;
};

const DateManagementPanel = ({ onDatesChanged }: DateManagementPanelProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customDates, setCustomDates] = useState<Date[]>(() => getCustomDates());
  const [newDateInput, setNewDateInput] = useState("");
  const [editingDate, setEditingDate] = useState<Date | null>(null);
  const [editDateInput, setEditDateInput] = useState("");

  const formatDate = (date: Date) => {
    return dayjs.utc(date).format("MMMM YYYY");
  };

  const formatDateForInput = (date: Date) => {
    return dayjs.utc(date).format("YYYY-MM");
  };

  const handleOpenModal = () => {
    setCustomDates(getCustomDates());
    setIsModalOpen(true);
  };

  const handleAddDate = () => {
    if (!newDateInput) return;
    const newDate = new Date(newDateInput + "-01");
    const updatedDates = addCustomDate(newDate);
    setCustomDates(updatedDates);
    setNewDateInput("");
    onDatesChanged();
  };

  const handleRemoveDate = (date: Date) => {
    const updatedDates = removeCustomDate(date);
    setCustomDates(updatedDates);
    onDatesChanged();
  };

  const handleStartEdit = (date: Date) => {
    setEditingDate(date);
    setEditDateInput(formatDateForInput(date));
  };

  const handleSaveEdit = () => {
    if (!editingDate || !editDateInput) return;
    const newDate = new Date(editDateInput + "-01");
    const updatedDates = updateCustomDate(editingDate, newDate);
    setCustomDates(updatedDates);
    setEditingDate(null);
    setEditDateInput("");
    onDatesChanged();
  };

  const handleCancelEdit = () => {
    setEditingDate(null);
    setEditDateInput("");
  };

  return (
    <>
      <Button
        color="light"
        size="sm"
        className="w-full"
        onClick={handleOpenModal}
      >
        <HiCalendar className="mr-2 h-4 w-4" />
        Manage Input Dates
      </Button>

      <Modal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="xl"
      >
        <Modal.Header>
          <div className="flex items-center gap-2">
            <HiCalendar className="h-5 w-5" />
            Manage Input Month Dates
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            {/* Info Section */}
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Add custom month dates for the input date selector. The system automatically shows months that have records in the database. Custom dates you add will be combined with those.
              </p>
            </div>

            {/* Add New Date Section */}
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <h3 className="mb-3 font-medium text-gray-900 dark:text-white">
                Add New Month
              </h3>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <Label htmlFor="new-date" value="Select Month" />
                  <TextInput
                    id="new-date"
                    type="month"
                    value={newDateInput}
                    onChange={(e) => setNewDateInput(e.target.value)}
                    placeholder="Select month..."
                  />
                </div>
                <Button
                  color="blue"
                  onClick={handleAddDate}
                  disabled={!newDateInput}
                >
                  <HiPlus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>

            {/* Custom Dates List */}
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <h3 className="mb-3 font-medium text-gray-900 dark:text-white">
                Custom Dates ({customDates.length})
              </h3>

              {customDates.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No custom dates added yet. Add a new month above to extend the available date range.
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {customDates
                    .sort((a, b) => b.getTime() - a.getTime())
                    .map((date) => (
                      <div
                        key={date.toISOString()}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
                      >
                        {editingDate?.getTime() === date.getTime() ? (
                          <div className="flex flex-1 items-center gap-3">
                            <TextInput
                              type="month"
                              value={editDateInput}
                              onChange={(e) => setEditDateInput(e.target.value)}
                              className="flex-1"
                            />
                            <Button size="sm" color="success" onClick={handleSaveEdit}>
                              Save
                            </Button>
                            <Button size="sm" color="light" onClick={handleCancelEdit}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {formatDate(date)}
                              </span>
                              <Badge color="info" size="sm">
                                Custom
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="xs"
                                color="light"
                                onClick={() => handleStartEdit(date)}
                              >
                                <HiPencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="xs"
                                color="failure"
                                onClick={() => handleRemoveDate(date)}
                              >
                                <HiTrash className="h-4 w-4" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Default Dates Info */}
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Available Dates
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                The system automatically includes months that have records in the database. You can add custom dates to extend the available range for months without records.
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DateManagementPanel;
