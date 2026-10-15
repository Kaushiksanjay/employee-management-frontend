import { useState } from "react";
import Modal from "./Modal";

export default function ConfirmDialog({ employee, onConfirm, onCancel }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setIsDeleting(true);
    setError("");
    try {
      await onConfirm(employee);
    } catch (err) {
      setError(err.message);
      setIsDeleting(false);
    }
  };

  return (
    <Modal title="Delete employee" onClose={onCancel}>
      <p>
        Delete <strong>{employee.fullName}</strong> ({employee.email})? This can't be undone.
      </p>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="dialog__actions">
        <button type="button" className="btn" onClick={onCancel} disabled={isDeleting}>
          Keep employee
        </button>
        <button type="button" className="btn btn--danger" onClick={handleConfirm} disabled={isDeleting}>
          {isDeleting ? "Deleting…" : "Delete employee"}
        </button>
      </div>
    </Modal>
  );
}
