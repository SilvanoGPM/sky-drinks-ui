import { showNotification } from './showNotification';

interface HandleErrorProps {
  error: any;
  fallback?: string;
  title?: string;
  maxDetailsChars?: number;
  description?: string;
}

/**
 * Pega os campos com erros.
 * @param error Erro que aconteceu.
 */
// eslint-disable-next-line
export function getFieldErrorsDescription(error: any): string {
  const errors = error?.response?.data?.fieldErrors;
  return errors ? Object.values(errors).flat().join('\n') : '';
}

/**
 * Manipula um determinado erro, mostrando uma notificação.
 * @param {any} error Erro que aconteceu
 * @param {string} [fallback=""] Mensagem caso não seja encontrada nehuma dentro do objeto de erro e nenhum título foi passado.
 * @param {string} title Título para o erro.
 * @param {number} [maxDetailsChars=200] Caso o máximos de caracteres seja atingo, o fallback vai ser utilizado.
 * @param {string} [description=""] Descrição do erro.
 */
export function handleError({
  error,
  fallback = '',
  title,
  maxDetailsChars = 200,
  description = '',
}: HandleErrorProps): void {
  const details = error?.response?.data?.details || error?.message || fallback;

  const message = details.length >= maxDetailsChars ? fallback : details;

  showNotification({
    type: 'warn',
    message: title || message,
    description,
  });
}
