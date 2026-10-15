import { useCallback, useEffect, useRef, useState } from "react";
import * as employeeApi from "../api/employeeApi";

const EMPTY_PAGE = { items: [], totalElements: 0, totalPages: 0 };

/**
 * Owns the current page of employees and all server mutations.
 * `query` is { page, size, search, status }; the list reloads whenever it changes.
 */
export function useEmployees({ page, size, search, status }) {
  const [data, setData] = useState(EMPTY_PAGE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const latestRequest = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++latestRequest.current;
    setIsLoading(true);
    setError(null);
    try {
      const result = await employeeApi.fetchEmployees({ page, size, search, status });
      if (requestId === latestRequest.current) setData(result); // ignore stale responses
    } catch (err) {
      if (requestId === latestRequest.current) setError(err.message);
    } finally {
      if (requestId === latestRequest.current) setIsLoading(false);
    }
  }, [page, size, search, status]);

  useEffect(() => {
    load();
  }, [load]);

  // Mutations rethrow so the calling form can show field-level errors,
  // then reload so the table reflects the server (counts, ordering, filters).
  const addEmployee = async (values) => {
    await employeeApi.createEmployee(values);
    await load();
  };

  const editEmployee = async (id, values) => {
    await employeeApi.updateEmployee(id, values);
    await load();
  };

  const removeEmployee = async (id) => {
    await employeeApi.deleteEmployee(id);
    await load();
  };

  return {
    employees: data.items,
    totalElements: data.totalElements,
    totalPages: data.totalPages,
    isLoading,
    error,
    reload: load,
    addEmployee,
    editEmployee,
    removeEmployee,
  };
}
