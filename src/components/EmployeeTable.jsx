import StatusBadge from "./StatusBadge";

export default function EmployeeTable({ employees, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Department</th>
            <th scope="col">Designation</th>
            <th scope="col">Status</th>
            <th scope="col" className="col-actions">
              <span className="visually-hidden">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td className="cell-id">{employee.id}</td>
              <th scope="row" className="cell-name">{employee.fullName}</th>
              <td>{employee.email}</td>
              <td>{employee.department}</td>
              <td>{employee.designation}</td>
              <td><StatusBadge status={employee.status} /></td>
              <td className="col-actions">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => onEdit(employee)}
                  aria-label={`Edit ${employee.fullName}`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn--ghost btn--danger-text"
                  onClick={() => onDelete(employee)}
                  aria-label={`Delete ${employee.fullName}`}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
