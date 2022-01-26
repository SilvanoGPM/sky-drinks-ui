import moment from 'moment';

import 'moment/locale/pt-br';

/**
 * Pega a idade do usuário baseado no nascimento do mesmo.
 * @param {string} birthDay Ano em que o usuário nasceu.
 */
export function getUserAge(birthDay: string): number {
  return moment().diff(birthDay, 'years');
}
