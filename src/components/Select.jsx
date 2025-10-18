// src/components/ui/Select.jsx
import React from "react";
import "../index.css";

export const Select = ({ value, onChange, children, className }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`select ${className || ""}`}
    >
      {children}
    </select>
  );
};

export const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);
