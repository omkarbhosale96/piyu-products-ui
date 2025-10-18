
// src/components/Button.jsx
import React from "react";
import "../index.css";

export const Button = ({ children, onClick, variant = "default", size = "md", disabled }) => {
  const classes = `custom-btn ${variant} ${size}`;
  return (
    <button className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
