import { Roles } from "src/enums/Roles";

export const roles = new Map<string, string>(Object.entries(Roles));

/**
 * Formata o cargo para melhor visualização.
 * @param  {string} role Cargo para ser formatado.
 */
export function formatDisplayRole(role: string = ""): string {
  const lastRole = role.split(",").pop()?.toUpperCase() || "";
  return roles.has(lastRole) ? roles.get(lastRole) || "" : "";
}
