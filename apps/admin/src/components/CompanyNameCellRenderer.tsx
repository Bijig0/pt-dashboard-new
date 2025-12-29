import React from "react";

type CompanyNameCellRendererProps = {
  value: any;
  companyNames?: string[];
};

const CompanyNameCellRenderer: React.FC<CompanyNameCellRendererProps> = (
  props
) => {
  const { value, companyNames = [] } = props;

  if (!value) return <>{value}</>;

  const isUnregistered = !companyNames.includes(value);

  if (isUnregistered) {
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
        <span>{value}</span>
        <span
          style={{ color: "#eab308" }}
          title="Warning: Unregistered company name"
        >
          ⚠️
        </span>
      </div>
    );
  }

  return <>{value}</>;
};

export default CompanyNameCellRenderer;
