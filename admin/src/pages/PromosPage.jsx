import React from 'react';
import CrudTable from './CrudTable';

const PromosPage = () => {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'code', label: 'Code' },
    { key: 'discount_type', label: 'Type' },
    { key: 'discount_value', label: 'Value' },
    { key: 'min_order', label: 'Min Order' },
    { key: 'max_uses', label: 'Max Uses' },
    { key: 'used_count', label: 'Used' },
    { key: 'expires_at', label: 'Expires' },
    { key: 'active', label: 'Active' },
  ];

  const fields = [
    { key: 'code', label: 'Code', type: 'text', placeholder: 'PROMO2024' },
    {
      key: 'discount_type', label: 'Discount Type', type: 'select',
      options: [
        { value: 'percentage', label: 'Percentage' },
        { value: 'fixed', label: 'Fixed' },
      ],
    },
    { key: 'discount_value', label: 'Discount Value', type: 'number', placeholder: '10' },
    { key: 'min_order', label: 'Min Order', type: 'number', placeholder: '0' },
    { key: 'max_uses', label: 'Max Uses', type: 'number', placeholder: '100' },
    { key: 'expires_at', label: 'Expires At', type: 'date' },
    { key: 'active', label: 'Active', type: 'checkbox', defaultValue: true },
  ];

  return (
    <CrudTable
      title="Promos"
      endpoint="/promos"
      columns={columns}
      fields={fields}
      emptyMessage="No promos found"
    />
  );
};

export default PromosPage;
