import React from 'react';
import CrudTable from './CrudTable';

const InterpretersPage = () => {
  const columns = [
    { key: 'id', label: '#' },
    { key: 'name', label: 'Name' },
    { key: 'bio', label: 'Bio' },
    { key: 'active', label: 'Active' },
  ];

  const fields = [
    { key: 'name', label: 'Name', type: 'text', placeholder: 'Interpreter name' },
    { key: 'bio', label: 'Bio', type: 'textarea' },
    { key: 'active', label: 'Active', type: 'checkbox', defaultValue: true },
  ];

  return (
    <CrudTable
      title="Interpreters"
      endpoint="/interpreters"
      columns={columns}
      fields={fields}
      emptyMessage="No interpreters found"
    />
  );
};

export default InterpretersPage;
