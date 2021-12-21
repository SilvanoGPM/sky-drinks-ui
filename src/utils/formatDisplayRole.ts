export function formatDisplayRole(role: string = "") {
  const lastRole = role.split(",").pop() || "";

  return lastRole.slice(0, 1).toUpperCase() + lastRole.slice(1).toLocaleLowerCase();
}
