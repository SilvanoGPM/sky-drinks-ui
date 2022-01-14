const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Verifica se uma cadeia de caracteres é um UUID.
 * @param {string} uuid // Cadeia de caracteres a ser verificada.
 */
export function isUUID(uuid: string): boolean {
  return uuidRegex.test(uuid);
}
