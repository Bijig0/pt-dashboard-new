import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const KEY_BACKSPACE = "Backspace";
const KEY_F2 = "F2";
const KEY_ENTER = "Enter";
const KEY_TAB = "Tab";

type MutuallyExclusiveEditorProps = {
  eventKey?: string;
  data?: any;
  field?: "masuk" | "keluar";
  stopEditing: () => void;
};

const MutuallyExclusiveEditor = memo(
  forwardRef((props: MutuallyExclusiveEditorProps, ref) => {
    const createInitialState = () => {
      let startValue;
      let highlightAllOnFocus = true;
      const eventKey = props.eventKey;

      if (eventKey === KEY_BACKSPACE) {
        // if backspace or delete pressed, we clear the cell
        startValue = "";
      } else if (eventKey && eventKey.length === 1) {
        // if a letter was pressed, we start with the letter
        startValue = eventKey;
        highlightAllOnFocus = false;
      } else {
        // otherwise we start with the current value
        startValue = "";
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
    const refInput = useRef<HTMLInputElement>(null);

    // Check if there's a mutual exclusivity issue
    const hasWarning = () => {
      if (!props.data || !props.field) return false;

      const currentFieldValue = parseInt(value) || 0;
      const oppositeField = props.field === "masuk" ? "keluar" : "masuk";
      const oppositeValue = props.data[oppositeField] ?? 0;

      return currentFieldValue > 0 && oppositeValue > 0;
    };

    // focus on the input
    useEffect(() => {
      // get ref from React component
      const eInput = refInput.current;
      if (!eInput) return;

      eInput.focus();
      if (highlightAllOnFocus) {
        eInput.select();

        setHighlightAllOnFocus(false);
      } else {
        // when we started editing, we want the caret at the end, not the start.
        // this comes into play in two scenarios:
        //   a) when user hits F2
        //   b) when user hits a printable character
        const length = eInput.value ? eInput.value.length : 0;
        if (length > 0) {
          eInput.setSelectionRange(length, length);
        }
      }
    }, []);

    /* Utility Methods */
    const cancelBeforeStart =
      props.eventKey &&
      props.eventKey.length === 1 &&
      "1234567890".indexOf(props.eventKey) < 0;

    const isLeftOrRight = (event: React.KeyboardEvent) => {
      return ["ArrowLeft", "ArrowRight"].indexOf(event.key) > -1;
    };

    const isCharNumeric = (charStr: string) => {
      return !!/\d/.test(charStr);
    };

    const isNumericKey = (event: React.KeyboardEvent) => {
      const charStr = event.key;
      return isCharNumeric(charStr);
    };

    const isBackspace = (event: React.KeyboardEvent) => {
      return event.key === KEY_BACKSPACE;
    };

    const finishedEditingPressed = (event: React.KeyboardEvent) => {
      const key = event.key;
      return key === KEY_ENTER || key === KEY_TAB;
    };

    const onKeyDown = (event: React.KeyboardEvent) => {
      if (isLeftOrRight(event) || isBackspace(event)) {
        event.stopPropagation();
        return;
      }

      if (!finishedEditingPressed(event) && !isNumericKey(event)) {
        if (event.preventDefault) event.preventDefault();
      }

      if (finishedEditingPressed(event)) {
        props.stopEditing();
      }
    };

    /* Component Editor Lifecycle methods */
    useImperativeHandle(ref, () => {
      return {
        // the final value to send to the grid, on completion of editing
        getValue() {
          return value === "" || value == null ? null : parseInt(value);
        },

        // Gets called once before editing starts, to give editor a chance to
        // cancel the editing before it even starts.
        isCancelBeforeStart() {
          return cancelBeforeStart;
        },

        // Gets called once when editing is finished (eg if Enter is pressed).
        // If you return true, then the result of the edit will be ignored.
        isCancelAfterEnd() {
          // will reject the number if it greater than 1,000,000
          // not very practical, but demonstrates the method.
          const finalValue = this.getValue();
          return finalValue != null && finalValue > 1000000;
        },
      };
    });

    const showWarning = hasWarning();

    return (
      <div className="relative w-full h-full flex items-center">
        <input
          type="number"
          ref={refInput}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => onKeyDown(event)}
          className={showWarning ? "border-2 border-yellow-500" : ""}
          style={{
            width: "100%",
            height: "100%",
            border: showWarning ? "2px solid #eab308" : "none",
            outline: "none",
            padding: "4px",
          }}
        />
        {showWarning && (
          <span
            className="absolute right-2 text-yellow-500"
            title="Warning: Both Masuk and Keluar have values"
          >
            ⚠️
          </span>
        )}
      </div>
    );
  })
);

export default MutuallyExclusiveEditor;
