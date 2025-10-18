// src/components/ui/Input.jsx
import React from "react";
import "../index.css";

const Input = ({ value, onChange, placeholder, className, type = "text" }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`input ${className || ""}`}
    />
  );
};

export { Input };
