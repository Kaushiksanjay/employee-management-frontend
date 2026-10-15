import apiClient from "./httpClient";
import { STATUS } from "../utils/constants";

// ---- Mapping between the backend JSON and the shape the UI uses ----
// Backend field names are assumed to be: id, fullName, email, department,
// designation, status. If yours differ, adjust ONLY these two functions.

function normalizeStatus(value) {
  return String(value || "").toUpperCase() === STATUS.INACTIVE
    ? STATUS.INACTIVE
    : STATUS.ACTIVE;
}

function fromApi(dto) {
  return {
    id: dto.id ?? dto.employeeId,
    fullName: dto.fullName ?? dto.name ?? "",
    email: dto.email ?? "",
    department: dto.department ?? "",
    designation: dto.designation ?? "",
    status: normalizeStatus(dto.status),
  };
}

function toApi(employee) {
  return {
    fullName: employee.fullName.trim(),
    email: employee.email.trim(),
    department: employee.department.trim(),
    designation: employee.designation.trim(),
    status: employee.status,
  };
}

// ---- Endpoints ----

/**
 * Fetches one page of employees. Search and status filtering happen on the server.
 * Expects Spring Data's Page JSON: { content, totalElements, totalPages, number, size }.
 */
export async function fetchEmployees({ page = 0, size = 10, search = "", status = "" } = {}) {
  const params = { page, size };
  if (search.trim()) params.search = search.trim();
  if (status) params.status = status;

  const { data } = await apiClient.get("/employees", { params });
  const content = data?.content ?? [];
  return {
    items: content.map(fromApi),
    totalElements: data?.totalElements ?? content.length,
    totalPages: data?.totalPages ?? 1,
  };
}

export async function fetchEmployee(id) {
  const { data } = await apiClient.get(`/employees/${id}`);
  return fromApi(data);
}

export async function createEmployee(employee) {
  const { data } = await apiClient.post("/employees", toApi(employee));
  return fromApi(data);
}

export async function updateEmployee(id, employee) {
  const { data } = await apiClient.put(`/employees/${id}`, toApi(employee));
  return fromApi(data);
}

export async function deleteEmployee(id) {
  await apiClient.delete(`/employees/${id}`);
}
