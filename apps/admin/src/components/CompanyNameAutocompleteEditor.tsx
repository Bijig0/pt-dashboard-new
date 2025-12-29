import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

const KEY_BACKSPACE = "Backspace";
const KEY_F2 = "F2";
const KEY_ENTER = "Enter";
const KEY_TAB = "Tab";
const KEY_ESCAPE = "Escape";
const KEY_ARROW_DOWN = "ArrowDown";
const KEY_ARROW_UP = "ArrowUp";

type CompanyNameAutocompleteEditorProps = {
  eventKey?: string;
  value?: string;
  stopEditing: () => void;
  companyNames?: string[];
};

const CompanyNameAutocompleteEditor = memo(
  forwardRef((props: CompanyNameAutocompleteEditorProps, ref) => {
    const { companyNames = [] } = props;

    const createInitialState = () => {
      let startValue;
      let highlightAllOnFocus = true;
      const eventKey = props.eventKey;

      if (eventKey === KEY_BACKSPACE) {
        startValue = "";
      } else if (eventKey && eventKey.length === 1) {
        startValue = eventKey;
        highlightAllOnFocus = false;
      } else {
        startValue = props.value || "";
        if (props.eventKey === KEY_F2) {
          highlightAllOnFocus = false;
        }
      }

      return {
        value: startValue,
        highlightAllOnFocus,
      };
    };

    const initialState = createInitialState();
    const [value, setValue] = useState(initialState.value);
    const [highlightAllOnFocus, setHighlightAllOnFocus] = useState(
      initialState.highlightAllOnFocus
    );
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [dropdownPosition, setDropdownPosition] = useState<{
      top: number;
      left: number;
      width: number;
    } | null>(null);
    const refInput = useRef<HTMLInputElement>(null);
    const refDropdown = useRef<HTMLDivElement>(null);
    const finalValueRef = useRef<string>(initialState.value);
    const showDropdownRef = useRef<boolean>(false);
    const filteredCompaniesRef = useRef<string[]>([]);

    // Filter company names based on input
    const filteredCompanies = value
      ? companyNames.filter((name) =>
          name.toLowerCase().includes(value.toLowerCase())
        )
      : companyNames;

    // Update refs immediately during render (synchronous)
    // This is critical for suppressKeyboardEvent to see the latest state BEFORE AG Grid processes events
    const shouldShowDropdown = filteredCompanies.length > 0 && value.length > 0;
    filteredCompaniesRef.current = filteredCompanies;
    showDropdownRef.current = shouldShowDropdown;

    // Update dropdown position when showing
    const updateDropdownPosition = () => {
      if (!refInput.current) return;
      const rect = refInput.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    };

    // Show dropdown if there are matches and input is focused
    useEffect(() => {
      setShowDropdown(shouldShowDropdown);
      setSelectedIndex(0); // Reset selection when filtered list changes

      if (shouldShowDropdown) {
        updateDropdownPosition();
      }
    }, [value, filteredCompanies.length, shouldShowDropdown]);

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

    // Cleanup dropdown on unmount
    useEffect(() => {
      return () => {
        setShowDropdown(false);
      };
    }, []);

    // Focus on the input
    useEffect(() => {
      const eInput = refInput.current;
      if (!eInput) return;

      eInput.focus();
      updateDropdownPosition(); // Calculate initial position

      // Initialize ref with current value
      finalValueRef.current = value;

      if (highlightAllOnFocus) {
        eInput.select();
        setHighlightAllOnFocus(false);
      } else {
        const length = eInput.value ? eInput.value.length : 0;
        if (length > 0) {
          eInput.setSelectionRange(length, length);
        }
      }
    }, []);

    const cancelBeforeStart =
      props.eventKey && props.eventKey.length === 1 && props.eventKey === KEY_ENTER;

    const selectCompany = (companyName: string) => {
      // CRITICAL: Update ref first
      finalValueRef.current = companyName;

      // Update UI state
      setValue(companyName);
      setShowDropdown(false);
      showDropdownRef.current = false;

      // Call stopEditing - getValue will use the ref
      props.stopEditing();
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

    const onKeyDown = (event: React.KeyboardEvent) => {
      // Arrow keys - always stop propagation
      if (event.key === KEY_ARROW_DOWN || event.key === KEY_ARROW_UP) {
        event.stopPropagation();

        if (showDropdown && filteredCompanies.length > 0) {
          event.preventDefault();
          if (event.key === KEY_ARROW_DOWN) {
            setSelectedIndex((prev) =>
              prev < filteredCompanies.length - 1 ? prev + 1 : prev
            );
          } else {
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          }
        }
        return;
      }

      // Escape key
      if (event.key === KEY_ESCAPE) {
        event.stopPropagation();
        setShowDropdown(false);
        return;
      }

      // Backspace - allow it through
      if (event.key === KEY_BACKSPACE) {
        event.stopPropagation();
        return;
      }

      // Enter key - this is the critical one
      if (event.key === KEY_ENTER) {
        // CRITICAL: Stop all event propagation IMMEDIATELY
        event.stopPropagation();
        event.preventDefault();

        console.log('[ENTER] Key pressed', {
          showDropdownRef: showDropdownRef.current,
          filteredCompaniesLength: filteredCompaniesRef.current.length,
          selectedIndex,
          value,
        });

        // Use refs to check dropdown state (same as suppressKeyboardEvent)
        // This ensures consistent state checking and avoids timing issues
        if (showDropdownRef.current && filteredCompaniesRef.current.length > 0) {
          const currentFilteredCompanies = filteredCompaniesRef.current;
          const selectedCompany = currentFilteredCompanies[selectedIndex] || currentFilteredCompanies[0]!;

          console.log('[ENTER] Selecting from dropdown:', selectedCompany);

          // CRITICAL: Update the ref FIRST before any async operations
          finalValueRef.current = selectedCompany;

          // Update UI state
          setValue(selectedCompany);
          setShowDropdown(false);
          showDropdownRef.current = false;

          // Immediately stop editing - getValue will read finalValueRef which is already updated
          props.stopEditing();
          return;
        }

        console.log('[ENTER] No dropdown - using typed value:', value);
        // No dropdown - normal Enter behavior
        props.stopEditing();
        return;
      }

      // Tab key
      if (event.key === KEY_TAB) {
        event.stopPropagation();
        props.stopEditing();
      }
    };

    const handleBlur = (event: React.FocusEvent) => {
      // Don't blur if clicking on dropdown
      if (
        refDropdown.current &&
        refDropdown.current.contains(event.relatedTarget as Node)
      ) {
        return;
      }
      setShowDropdown(false);
    };

    useImperativeHandle(ref, () => {
      return {
        getValue() {
          // Use the ref value which is always up-to-date
          const currentValue = finalValueRef.current;
          console.log('[getValue] Returning:', currentValue);
          return currentValue === "" ? null : currentValue;
        },

        isCancelBeforeStart() {
          return cancelBeforeStart;
        },

        isCancelAfterEnd() {
          return false;
        },

        // Tell AG Grid this is a popup editor - handles events differently
        isPopup() {
          return true;
        },

        // Tell AG Grid to ignore keyboard events when dropdown is showing
        suppressKeyboardEvent(params: any) {
          const { event } = params;
          const key = event.key;

          console.log('[suppressKeyboardEvent]', {
            key,
            showDropdownRef: showDropdownRef.current,
            filteredCompaniesLength: filteredCompaniesRef.current.length,
          });

          // When dropdown is showing, suppress AG Grid's handling of these keys
          // Use refs to get current state (closures would be stale)
          if (showDropdownRef.current && filteredCompaniesRef.current.length > 0) {
            const shouldSuppress = (
              key === KEY_ENTER ||
              key === KEY_TAB ||
              key === KEY_ARROW_DOWN ||
              key === KEY_ARROW_UP ||
              key === KEY_ESCAPE
            );
            console.log('[suppressKeyboardEvent] Returning:', shouldSuppress);
            return shouldSuppress;
          }

          console.log('[suppressKeyboardEvent] Returning: false');
          return false;
        },
      };
    });

    const renderDropdown = () => {
      if (!showDropdown || filteredCompanies.length === 0 || !dropdownPosition) {
        return null;
      }

      return createPortal(
        <div
          ref={refDropdown}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          style={{
            position: "absolute",
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            zIndex: 9999,
          }}
        >
          {filteredCompanies.map((companyName, index) => (
            <div
              key={companyName}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                selectCompany(companyName);
              }}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`px-3 py-2 cursor-pointer text-sm ${
                index === selectedIndex
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                  : "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {highlightMatch(companyName, value)}
            </div>
          ))}
        </div>,
        document.body
      );
    };

    return (
      <>
        <input
          type="text"
          ref={refInput}
          value={value}
          onChange={(event) => {
            const newValue = event.target.value;
            setValue(newValue);
            finalValueRef.current = newValue;
          }}
          onKeyDownCapture={onKeyDown}
          onBlur={handleBlur}
          onFocus={updateDropdownPosition}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            outline: "none",
            padding: "4px",
          }}
        />
        {renderDropdown()}
      </>
    );
  })
);

export default CompanyNameAutocompleteEditor;
