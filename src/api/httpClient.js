import axios from "axios";

/** Error carrying the HTTP status and any field-level errors from the backend. */
export class ApiError extends Error {
  constructor(message, { status = 0, fieldErrors = {} } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

const FALLBACK_MESSAGES = {
  400: "The request was invalid. Check the details and try again.",
  404: "That record no longer exists.",
  409: "This conflicts with an existing record.",
  500: "The server ran into a problem. Try again in a moment.",
};

function toApiError(error) {
  // No response: server down, network failure or timeout.
  if (!error.response) {
    return new ApiError(
      error.code === "ECONNABORTED"
        ? "The server took too long to respond. Try again."
        : "Can't reach the server. Check that the backend is running and try again."
    );
  }

  const { status, data: body } = error.response;

  // Supports the common Spring Boot shapes:
  //   { message: "...", errors: { field: "msg" } }  |  { error: "..." }  |  plain string
  const message =
    (body && typeof body === "object" && (body.message || body.error)) ||
    (typeof body === "string" && body) ||
    FALLBACK_MESSAGES[status] ||
    `Request failed (${status}).`;

  const rawFieldErrors =
    (body && typeof body === "object" && (body.errors || body.fieldErrors)) || {};
  const fieldErrors = Array.isArray(rawFieldErrors)
    ? Object.fromEntries(
        rawFieldErrors
          .filter((e) => e && e.field)
          .map((e) => [e.field, e.message || e.defaultMessage || "Invalid value"])
      )
    : rawFieldErrors;

  return new ApiError(message, { status, fieldErrors });
}


const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, ""),
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(toApiError(error))
);

export default apiClient;
