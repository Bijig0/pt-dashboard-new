import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const KEY_NEGATIVE = "-";
const KEY_ENTER = "Enter";
const KEY_TAB = "Tab";

const NegativeIntegerEditor = memo(
  forwardRef((props, ref) => {
    const [value, setValue] = useState<string>(props.value);
    const refInput = useRef(null);

    useEffect(() => {
      // focus on the input
      refInput.current.focus();
    }, []);

    /* Component Editor Lifecycle methods */
    useImperativeHandle(ref, () => {
      return {
        // the final value to send to the grid, on completion of editing
        getValue() {
          // this simple editor doubles any value entered into the input
          return parseInt(value);
        },

        // Gets called once before editing starts, to give editor a chance to
        // cancel the editing before it even starts.
        isCancelBeforeStart() {
          return false;
        },

        // Gets called once when editing is finished (eg if Enter is pressed).
        // If you return true, then the result of the edit will be ignored.
        isCancelAfterEnd() {
          return Math.sign(parseInt(value)) === 1;
        },
      };
    });

    const onKeyDown = (event) => {
      const isEmpty = Number.isNaN(value);

      const finishedEditingPressed = (event) => {
        const key = event.key;
        return key === KEY_ENTER || key === KEY_TAB;
      };

      const isNegativeSign = (event) => {
        return event.key === KEY_NEGATIVE;
      };

      console.log({
        condition: !finishedEditingPressed(event) && !isNegativeSign && isEmpty,
      });

      if (!finishedEditingPressed(event) && !isNegativeSign(event) && isEmpty) {
        event.preventDefault();
      }
    };

    return (
      <input
        type="number"
        ref={refInput}
        value={value}
        onKeyDown={onKeyDown}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  })
);

export default NegativeIntegerEditor;
