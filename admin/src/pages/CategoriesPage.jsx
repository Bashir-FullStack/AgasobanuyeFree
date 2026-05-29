import React from 'react';
import CrudTable from './CrudTable';

const CategoriesPage = () => {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'active', label: 'Active' },
  ];

  const fields = [
    { key: 'name', label: 'Name', type: 'text', placeholder: 'Category name' },
    { key: 'active', label: 'Active', type: 'checkbox', defaultValue: true },
  ];

  return (
    <CrudTable
      title="Categories"
      endpoint="/categories"
      columns={columns}
      fields={fields}
      emptyMessage="No categories found"
    />
  );
};

export default CategoriesPage;
