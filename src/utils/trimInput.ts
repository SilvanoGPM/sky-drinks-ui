import { FormInstance } from "antd";

/**
 * Faz o trim de um determinado campo.
 * @param  {FormInstance} form Instância do formulário onde o campo se encontra.
 */
export function trimInput(form: FormInstance): (input: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement>) => void {
  return (input: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const { id, value } = input.target;

    const fieldName = id.replace(`${form.__INTERNAL__.name}_`, "");

    form.setFieldsValue({ [fieldName]: value.trim() });
  };
}
