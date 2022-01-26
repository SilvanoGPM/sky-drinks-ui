import { useEffect, useState } from 'react';
import { Select } from 'antd';

import endpoints from 'src/api/api';
import { LoadingIndicator } from 'src/components/other/LoadingIndicator';
import { handleError } from 'src/utils/handleError';

const { Option } = Select;

interface FetchTablesProps {
  defaultTable?: TableType;
  onChange: (table?: TableType) => void;
}

export function FetchTables({
  defaultTable,
  onChange,
}: FetchTablesProps): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [tables, setTables] = useState<TableType[]>([]);

  useEffect(() => {
    async function loadTables(): Promise<void> {
      try {
        const data = await endpoints.getAllTables();
        setTables(data.content);
      } catch (error: any) {
        handleError({
          error,
          fallback: 'Não foi possível carregar mesas',
        });
      } finally {
        setLoading(false);
      }
    }

    if (loading) {
      loadTables();
    }

    return () => {
      setLoading(false);
    };
  }, [loading]);

  function handleChange(value: string): void {
    const tableFound = tables.find(
      (table) => String(table.number) === String(value)
    );
    onChange(tableFound);
  }

  return loading ? (
    <LoadingIndicator />
  ) : (
    <Select
      style={{ width: '50%' }}
      onChange={handleChange}
      defaultValue={defaultTable ? String(defaultTable.number) : 'null'}
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
