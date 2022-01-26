export const roles = new Map<string, string>(
  Object.entries({
    GUEST: 'Visitante',
    USER: 'Usuário',
    BARMEN: 'Barmen',
    WAITER: 'Garçom',
    ADMIN: 'Administrador',
  })
);

/**
 * Formata o cargo para melhor visualização.
 * @param  {string} role Cargo para ser formatado.
 */
export function formatDisplayRole(role = ''): string {
  const lastRole = role.split(',').pop()?.toUpperCase() || '';
  return roles.has(lastRole) ? roles.get(lastRole) || '' : '';
}
