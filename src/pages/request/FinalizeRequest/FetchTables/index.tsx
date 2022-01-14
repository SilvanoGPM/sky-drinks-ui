import { Select } from "antd";
import { useEffect, useState } from "react";
import endpoints from "src/api/api";
import { Loading } from "src/components/layout/Loading";
import { handleError } from "src/utils/handleError";

const { Option } = Select;

type TableType = {
  uuid: string;
  number: number;
};

type FetchTablesProps = {
  defaultTable?: TableType;
  onChange: (table?: TableType) => void;
};

export function FetchTables({ defaultTable, onChange }: FetchTablesProps) {
  const [loading, setLoading] = useState(true);
  const [tables, setTables] = useState<TableType[]>([]);

  useEffect(() => {
    async function loadTables() {
      try {
        const data = await endpoints.getAllTables();
        setTables(data.content);
      } catch (error: any) {
        handleError({
          error,
          fallback: "Não foi possível carregar mesas",
        });
      } finally {
        setLoading(false);
      }

      return () => {
        setLoading(false);
      };
    }

    if (loading) {
      loadTables();
    }
  }, [loading]);

  function handleChange(value: string) {
    const tableFound = tables.find(
      (table) => String(table.number) === String(value)
    );
    onChange(tableFound);
  }

  return loading ? (
    <Loading />
  ) : (
    <Select
      style={{ width: "50%" }}
      onChange={handleChange}
      defaultValue={defaultTable ? String(defaultTable.number) : "null"}
    >
      <Option value="null">Nenhuma</Option>
      {tables.map(({ number }) => (
        <Option key={number} value={String(number)}>
          Mesa n° {number}
        </Option>
      ))}
    </Select>
  );
}
