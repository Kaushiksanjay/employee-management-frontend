// Values sent to / received from the backend for the Status field.
// If your Spring Boot enum differs (e.g. "Active"), change it here only.
export const STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

export const STATUS_FILTER = {
  ALL: "ALL",
  ...STATUS,
};

export const DEPARTMENTS = [
  "Engineering",
  "Human Resources",
  "Finance",
  "Marketing",
  "Sales",
  "Operations",
  "Support",
  "IT",
];

export const EMPTY_EMPLOYEE = {
  fullName: "",
  email: "",
  department: "",
  designation: "",
  status: STATUS.ACTIVE,
};
