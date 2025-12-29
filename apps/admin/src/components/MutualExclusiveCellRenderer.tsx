import React from "react";

type MutualExclusiveCellRendererProps = {
  value: any;
  data: any;
};

const MutualExclusiveCellRenderer: React.FC<
  MutualExclusiveCellRendererProps
> = (props) => {
  const { value, data } = props;

  const masukValue = data?.masuk ?? 0;
  const keluarValue = data?.keluar ?? 0;
  const hasWarning = masukValue > 0 && keluarValue > 0;

  if (hasWarning) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
        }}
      >
        <span>{value ?? ""}</span>
        <span
          style={{ color: "#eab308" }}
          title="Warning: Both Masuk and Keluar have values"
        >
          ⚠️
        </span>
      </div>
    );
  }

  return <>{value}</>;
};

export default MutualExclusiveCellRenderer;
