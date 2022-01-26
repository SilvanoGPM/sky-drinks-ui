/**
 * Formata uma determinada string para o estilo do CPF.
 * @param {string} cpf O cpf para formatar.
 * {@link https://medium.com/trainingcenter/mascara-de-cpf-com-react-javascript-a07719345c93 Esse código foi retirado daqui}
 */
export function cpfMask(cpf: string): string {
  return cpf
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
}
