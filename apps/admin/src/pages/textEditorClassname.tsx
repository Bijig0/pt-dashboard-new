import type { RenderEditCellProps } from "react-data-grid";

export const textEditorClassname = `rdg-text-editor w-full h-full p-0 pl-2 border-2 border-gray-300 align-top text-current bg-current font-inherit leading-normal focus:border-red-500 focus:outline-none placeholder-gray-500 placeholder-opacity-100`;

function autoFocusAndSelect(input: HTMLInputElement | null) {
  input?.focus();
  input?.select();
}

export default function textEditor<TRow, TSummaryRow>({
  row,
  column,
  onRowChange,
  onClose,
}: RenderEditCellProps<TRow, TSummaryRow>) {
  return (
    <input
      className={textEditorClassname}
      ref={autoFocusAndSelect}
      value={row[column.key as keyof TRow] as unknown as string}
      onChange={(event) =>
        onRowChange({ ...row, [column.key]: event.target.value })
      }
      onBlur={() => onClose(true, false)}
    />
  );
}
