/**
 * Pega as permissões que um determinado possuí baseado no cargo.
 * @param [role="GUEST"] Cargo do usuário.
 */
export function getUserPermissions(role = 'GUEST'): UserPermissions {
  const isGuest = role.includes('GUEST');
  const isAdmin = role.includes('ADMIN');
  const isBarmen = role.includes('BARMEN');
  const isWaiter = role.includes('WAITER');
  const isUser = role.includes('USER');

  return {
    isGuest,
    isAdmin,
    isBarmen,
    isWaiter,
    isUser,
  };
}
