import { useState } from "react";
import FormField from "./FormField";
import Modal from "./Modal";
import { DEPARTMENTS, EMPTY_EMPLOYEE, STATUS } from "../utils/constants";
import { validateEmployee } from "../utils/validation";

/**
 * Used for both "Add" (employee is null) and "Edit" (employee is provided).
 * onSubmit(values) should return a promise and throw ApiError on failure.
 */
export default function EmployeeForm({ employee, onSubmit, onCancel }) {
  const isEditing = Boolean(employee);
  const [values, setValues] = useState(
    employee
      ? {
          fullName: employee.fullName,
          email: employee.email,
          department: employee.department,
          designation: employee.designation,
          status: employee.status,
        }
      : EMPTY_EMPLOYEE
  );
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const setField = (name) => (event) => {
    setValues((current) => ({ ...current, [name]: event.target.value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    const validationErrors = validateEmployee(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);
    try {
      await onSubmit(values);
    } catch (err) {
      // Show backend field errors inline (e.g. duplicate email); otherwise a general message.
      const fieldErrors = { ...(err.fieldErrors || {}) };
      if (err.status === 409 && !fieldErrors.email) {
        fieldErrors.email = err.message || "An employee with this email already exists.";
      }
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      } else {
        setFormError(err.message);
      }
      setIsSaving(false);
    }
  };

  return (
    <Modal title={isEditing ? "Edit employee" : "Add employee"} onClose={onCancel}>
      <form onSubmit={handleSubmit} noValidate>
        <FormField id="fullName" label="Full name" error={errors.fullName}>
          <input id="fullName" value={values.fullName} onChange={setField("fullName")}
            autoComplete="off" aria-invalid={Boolean(errors.fullName)} />
        </FormField>

        <FormField id="email" label="Email" error={errors.email}>
          <input id="email" type="email" value={values.email} onChange={setField("email")}
            autoComplete="off" aria-invalid={Boolean(errors.email)} />
        </FormField>

        <div className="form-row">
          <FormField id="department" label="Department" error={errors.department}>
            <input id="department" list="department-options" value={values.department}
              onChange={setField("department")} aria-invalid={Boolean(errors.department)} />
            <datalist id="department-options">
              {DEPARTMENTS.map((d) => <option key={d} value={d} />)}
            </datalist>
          </FormField>

          <FormField id="designation" label="Designation" error={errors.designation}>
            <input id="designation" value={values.designation} onChange={setField("designation")}
              aria-invalid={Boolean(errors.designation)} />
          </FormField>
        </div>

        <FormField id="status" label="Status" error={errors.status}>
          <select id="status" value={values.status} onChange={setField("status")}>
            <option value={STATUS.ACTIVE}>Active</option>
            <option value={STATUS.INACTIVE}>Inactive</option>
          </select>
        </FormField>

        {formError && <p className="form-error" role="alert">{formError}</p>}

        <div className="dialog__actions">
          <button type="button" className="btn" onClick={onCancel} disabled={isSaving}>Cancel</button>
          <button type="submit" className="btn btn--primary" disabled={isSaving}>
            {isSaving ? "Saving…" : isEditing ? "Save changes" : "Add employee"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
