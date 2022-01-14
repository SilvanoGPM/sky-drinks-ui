import { Roles } from "src/enums/Roles";

export const roles = new Map<string, string>(
  Object.entries(Roles)
);

export function formatDisplayRole(role: string = "") {
  const lastRole = role.split(",").pop()?.toUpperCase() || "";
  return roles.has(lastRole) ? roles.get(lastRole) : "";
}
