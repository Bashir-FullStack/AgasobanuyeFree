import React from 'react';
import CrudTable from './CrudTable';

const BookingsPage = () => {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'message', label: 'Message' },
    { key: 'created_at', label: 'Date' },
  ];

  const fields = [
    { key: 'name', label: 'Name', type: 'text', placeholder: 'Full name' },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com' },
    { key: 'phone', label: 'Phone', type: 'text', placeholder: 'Phone number' },
    { key: 'message', label: 'Message', type: 'textarea' },
  ];

  return (
    <CrudTable
      title="Bookings"
      endpoint="/bookings"
      columns={columns}
      fields={fields}
      emptyMessage="No bookings found"
    />
  );
};

export default BookingsPage;
