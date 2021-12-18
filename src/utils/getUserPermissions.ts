export function getUserPermissions(role: string = "GUEST") {
  const isGuest = role.includes("GUEST");
  const isAdmin = role.includes("ADMIN");
  const isBarmen = role.includes("BARMEN");
  const isWaiter = role.includes("WAITER");
  const isUser = role.includes("USER");

  return {
    isGuest,
    isAdmin,
    isBarmen,
    isWaiter,
    isUser,
  };
}
