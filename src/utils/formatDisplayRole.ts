const roles = new Map<string, string>();

roles.set("USER", "Usuário");
roles.set("BARMEN", "Barmen");
roles.set("WAITER", "Garçom");
roles.set("ADMIN", "Admin");

export function formatDisplayRole(role: string = "") {
  const lastRole = role.split(",").pop()?.toUpperCase() || "";
  return roles.has(lastRole) ? roles.get(lastRole) : "";
}
