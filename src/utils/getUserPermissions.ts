interface UserPermissions {
  isGuest: boolean;
  isAdmin: boolean;
  isBarmen: boolean;
  isWaiter: boolean;
  isUser: boolean;
}

/**
 * Pega as permissões que um determinado possuí baseado no cargo.
 * @param  {string} [role="GUEST"] Cargo do usuário.
 */
export function getUserPermissions(role: string = "GUEST"): UserPermissions {
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
