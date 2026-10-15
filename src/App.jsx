import { useCallback, useEffect, useState } from "react";
import ConfirmDialog from "./components/ConfirmDialog";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeTable from "./components/EmployeeTable";
import Pagination from "./components/Pagination";
import SearchBar from "./components/SearchBar";
import StatusFilter from "./components/StatusFilter";
import { EmptyState, ErrorState, LoadingState } from "./components/StateMessages";
import Toast from "./components/Toast";
import { useDebounce } from "./hooks/useDebounce";
import { useEmployees } from "./hooks/useEmployees";
import { STATUS_FILTER } from "./utils/constants";

const DEFAULT_PAGE_SIZE = 10;

export default function App() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(STATUS_FILTER.ALL);
  const [formState, setFormState] = useState(null); // null | { employee: Employee | null }
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const debouncedSearch = useDebounce(searchTerm);
  const dismissToast = useCallback(() => setToastMessage(""), []);

  const {
    employees, totalElements, totalPages, isLoading, error, reload,
    addEmployee, editEmployee, removeEmployee,
  } = useEmployees({
    page,
    size: pageSize,
    search: debouncedSearch,
    status: statusFilter === STATUS_FILTER.ALL ? "" : statusFilter,
  });

  // If the current page no longer exists (e.g. the last row was deleted), step back.
  useEffect(() => {
    const lastPage = Math.max(totalPages, 1) - 1;
    if (!isLoading && !error && page > lastPage) setPage(lastPage);
  }, [isLoading, error, page, totalPages]);

  const isFiltered = searchTerm.trim() !== "" || statusFilter !== STATUS_FILTER.ALL;

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(0);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setPage(0);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setPage(0);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter(STATUS_FILTER.ALL);
    setPage(0);
  };

  const handleSave = async (values) => {
    if (formState.employee) {
      await editEmployee(formState.employee.id, values);
      setToastMessage("Changes saved.");
    } else {
      await addEmployee(values);
      setToastMessage("Employee added.");
    }
    setFormState(null);
  };

  const handleDelete = async (employee) => {
    await removeEmployee(employee.id);
    setEmployeeToDelete(null);
    setToastMessage("Employee deleted.");
  };

  const renderContent = () => {
    if (error) return <ErrorState message={error} onRetry={reload} />;
    if (isLoading && employees.length === 0) return <LoadingState />;
    if (employees.length === 0) {
      return (
        <EmptyState
          isFiltered={isFiltered}
          onAdd={() => setFormState({ employee: null })}
          onClearFilters={clearFilters}
        />
      );
    }
    return (
      <div className={isLoading ? "is-refreshing" : ""} aria-busy={isLoading}>
        <EmployeeTable
          employees={employees}
          onEdit={(employee) => setFormState({ employee })}
          onDelete={setEmployeeToDelete}
        />
      </div>
    );
  };

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1>Employees</h1>
          {!error && (
            <p className="page__summary">
              {totalElements} {isFiltered ? "matching" : "total"}
            </p>
          )}
        </div>
        <button type="button" className="btn btn--primary" onClick={() => setFormState({ employee: null })}>
          Add employee
        </button>
      </header>

      <section className="toolbar" aria-label="Search and filter">
        <SearchBar value={searchTerm} onChange={handleSearchChange} />
        <StatusFilter value={statusFilter} onChange={handleStatusChange} />
        {isFiltered && (
          <button type="button" className="btn" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </section>

      <main className="panel">
        {renderContent()}
        {!error && (
          <Pagination
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            totalElements={totalElements}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </main>

      {formState && (
        <EmployeeForm
          employee={formState.employee}
          onSubmit={handleSave}
          onCancel={() => setFormState(null)}
        />
      )}
      {employeeToDelete && (
        <ConfirmDialog
          employee={employeeToDelete}
          onConfirm={handleDelete}
          onCancel={() => setEmployeeToDelete(null)}
        />
      )}
      <Toast message={toastMessage} onDismiss={dismissToast} />
    </div>
  );
}
