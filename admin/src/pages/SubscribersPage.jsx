import React from 'react';
import CrudTable from './CrudTable';

const SubscribersPage = () => {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'email', label: 'Email' },
    { key: 'name', label: 'Name' },
    { key: 'active', label: 'Active' },
    { key: 'subscribed_at', label: 'Subscribed Date' },
  ];

  const fields = [
    { key: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com' },
    { key: 'name', label: 'Name', type: 'text', placeholder: 'Full name' },
    { key: 'active', label: 'Active', type: 'checkbox', defaultValue: true },
  ];

  return (
    <CrudTable
      title="Subscribers"
      endpoint="/subscribers"
      columns={columns}
      fields={fields}
      emptyMessage="No subscribers found"
    />
  );
};

export default SubscribersPage;
