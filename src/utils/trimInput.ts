import { FormInstance } from "antd";

export function trimInput(form: FormInstance) {
  return (input: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const { id, value } = input.target;

    const fieldName = id.replace(`${form.__INTERNAL__.name}_`, "");

    form.setFieldsValue({ [fieldName]: value.trim() });
  };
}
