import {
  useEffect,
  useRef,
  useState,
  ForwardedRef,
  forwardRef,
} from "react";
import { createPortal } from "react-dom";

const KEY_BACKSPACE = "Backspace";
const KEY_ENTER = "Enter";
const KEY_TAB = "Tab";
const KEY_ESCAPE = "Escape";
const KEY_ARROW_DOWN = "ArrowDown";
const KEY_ARROW_UP = "ArrowUp";

type SearchableDropdownProps = {
  id: string;
  name: string;
  value: string | number;
  options: Array<{ value: string | number; label: string }>;
  onChange: (value: string | number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

const SearchableDropdown = forwardRef(
  (props: SearchableDropdownProps, ref: ForwardedRef<HTMLDivElement>) => {
    const {
      id,
      name,
      value,
      options,
      onChange,
      placeholder = "Select an option...",
      className = "",
      disabled = false,
    } = props;

    const [searchValue, setSearchValue] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [dropdownPosition, setDropdownPosition] = useState<{
      top: number;
      left: number;
      width: number;
    } | null>(null);

    const refInput = useRef<HTMLInputElement>(null);
    const refDropdown = useRef<HTMLDivElement>(null);
    const refContainer = useRef<HTMLDivElement>(null);
    const refSelectedOption = useRef<HTMLDivElement>(null);

    // Get the label for the current value
    const getSelectedLabel = () => {
      const option = options.find((opt) => opt.value === value);
      return option ? option.label : "";
    };

    const selectedLabel = getSelectedLabel();

    // Filter options based on search input
    const filteredOptions = searchValue
      ? options.filter((option) =>
          option.label.toLowerCase().includes(searchValue.toLowerCase())
        )
      : options;

    // Scroll selected item into view when selectedIndex changes
    useEffect(() => {
      if (showDropdown && refSelectedOption.current) {
        refSelectedOption.current.scrollIntoView({
          block: "nearest",
          behavior: "auto",
        });
      }
    }, [selectedIndex, showDropdown]);

    // Update dropdown position
    const updateDropdownPosition = () => {
      if (!refContainer.current) return;
      const rect = refContainer.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    };

    // Update position on scroll/resize
    useEffect(() => {
      if (!showDropdown) return;

      const handleUpdate = () => updateDropdownPosition();
      window.addEventListener("scroll", handleUpdate, true);
      window.addEventListener("resize", handleUpdate);

      return () => {
        window.removeEventListener("scroll", handleUpdate, true);
        window.removeEventListener("resize", handleUpdate);
      };
    }, [showDropdown]);

    // Reset search when dropdown closes, or set to current value when opening
    useEffect(() => {
      if (!showDropdown) {
        setSearchValue("");
        setSelectedIndex(0);
      } else {
        updateDropdownPosition();
        // Find the index of the currently selected value
        const currentIndex = options.findIndex((opt) => opt.value === value);
        if (currentIndex !== -1) {
          setSelectedIndex(currentIndex);
        }
      }
    }, [showDropdown, options, value]);

    const selectOption = (optionValue: string | number) => {
      onChange(optionValue);
      setShowDropdown(false);
      setSearchValue("");
    };

    // Highlight matched text in dropdown
    const highlightMatch = (text: string, query: string) => {
      if (!query) return text;

      const lowerText = text.toLowerCase();
      const lowerQuery = query.toLowerCase();
      const index = lowerText.indexOf(lowerQuery);

      if (index === -1) return text;

      const before = text.slice(0, index);
      const match = text.slice(index, index + query.length);
      const after = text.slice(index + query.length);

      return (
        <>
          {before}
          <strong className="font-bold text-blue-700 dark:text-blue-300">
            {match}
          </strong>
          {after}
        </>
      );
    };

    const handleInputFocus = () => {
      if (!disabled) {
        setShowDropdown(true);
        updateDropdownPosition();
        // Select all text for easy filtering
        setTimeout(() => {
          refInput.current?.select();
        }, 0);
      }
    };

    const handleInputBlur = (event: React.FocusEvent) => {
      // Don't blur if clicking on dropdown
      if (
        refDropdown.current &&
        refDropdown.current.contains(event.relatedTarget as Node)
      ) {
        return;
      }
      setShowDropdown(false);
    };

    const onKeyDown = (event: React.KeyboardEvent) => {
      // Arrow keys
      if (event.key === KEY_ARROW_DOWN || event.key === KEY_ARROW_UP) {
        event.preventDefault();
        if (showDropdown && filteredOptions.length > 0) {
          if (event.key === KEY_ARROW_DOWN) {
            setSelectedIndex((prev) =>
              prev < filteredOptions.length - 1 ? prev + 1 : prev
            );
          } else {
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          }
        } else if (!showDropdown) {
          setShowDropdown(true);
        }
        return;
      }

      // Escape key
      if (event.key === KEY_ESCAPE) {
        event.preventDefault();
        setShowDropdown(false);
        refInput.current?.blur();
        return;
      }

      // Enter key
      if (event.key === KEY_ENTER) {
        event.preventDefault();
        if (showDropdown && filteredOptions.length > 0) {
          const selectedOption = filteredOptions[selectedIndex];
          if (selectedOption) {
            selectOption(selectedOption.value);
          }
        } else {
          setShowDropdown(true);
        }
        return;
      }

      // Tab key
      if (event.key === KEY_TAB) {
        setShowDropdown(false);
      }
    };

    const renderDropdown = () => {
      if (!showDropdown || filteredOptions.length === 0 || !dropdownPosition) {
        return null;
      }

      return createPortal(
        <div
          ref={refDropdown}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto z-[9999]"
          style={{
            position: "absolute",
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            zIndex: 9999,
          }}
        >
          {filteredOptions.map((option, index) => (
            <div
              key={option.value}
              ref={index === selectedIndex ? refSelectedOption : null}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                selectOption(option.value);
              }}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`px-3 py-2 cursor-pointer text-sm ${
                index === selectedIndex
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                  : "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {highlightMatch(option.label, searchValue)}
            </div>
          ))}
        </div>,
        document.body
      );
    };

    return (
      <div ref={refContainer} className={`relative ${className}`}>
        <div
          ref={ref}
          className={`flex items-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus-within:ring-blue-500 focus-within:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus-within:ring-blue-500 dark:focus-within:border-blue-500 ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <input
            ref={refInput}
            type="text"
            id={id}
            data-testid={id}
            name={name}
            value={showDropdown ? (searchValue || selectedLabel) : selectedLabel}
            onChange={(e) => {
              setSearchValue(e.target.value);
              if (!showDropdown) {
                setShowDropdown(true);
              }
            }}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 bg-transparent border-none outline-none p-2.5 text-sm"
            autoComplete="off"
          />
          <svg
            className="w-4 h-4 mr-2.5 text-gray-500 dark:text-gray-400 cursor-pointer"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => {
              if (!disabled) {
                if (showDropdown) {
                  setShowDropdown(false);
                } else {
                  setShowDropdown(true);
                  updateDropdownPosition();
                  // Focus and select all text for easy filtering
                  setTimeout(() => {
                    refInput.current?.focus();
                    refInput.current?.select();
                  }, 0);
                }
              }
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        {renderDropdown()}
      </div>
    );
  }
);

SearchableDropdown.displayName = "SearchableDropdown";

export default SearchableDropdown;
