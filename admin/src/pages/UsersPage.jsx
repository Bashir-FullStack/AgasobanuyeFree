import React from 'react';
import CrudTable from './CrudTable';

const UsersPage = () => {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'email', label: 'Email' },
    { key: 'name', label: 'Name' },
    { key: 'active', label: 'Active' },
  ];

  const fields = [
    { key: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com' },
    { key: 'name', label: 'Name', type: 'text', placeholder: 'Full name' },
    { key: 'password', label: 'Password', type: 'password', placeholder: 'Leave blank to keep' },
    { key: 'active', label: 'Active', type: 'checkbox', defaultValue: true },
  ];

  return (
    <CrudTable
      title="Users"
      endpoint="/users"
      columns={columns}
      fields={fields}
      emptyMessage="No users found"
    />
  );
};

export default UsersPage;
