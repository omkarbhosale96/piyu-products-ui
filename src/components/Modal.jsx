import React from "react";
import "../index.css";

const Modal = ({ open, onClose, title, description, onConfirm, loading }) => {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="modal-actions">
          <button
            className="btn-cancel"
            onClick={onClose}
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            Cancel
          </button>
          <button
            className="btn-confirm"
            onClick={onConfirm}
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
