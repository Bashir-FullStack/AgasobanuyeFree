import React from 'react';
import CrudTable from './CrudTable';

const BannersPage = () => {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title' },
    { key: 'link_url', label: 'Link URL' },
    { key: 'active', label: 'Active' },
  ];

  const fields = [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Banner title' },
    { key: 'image_url', label: 'Image URL', type: 'text', placeholder: 'https://...' },
    { key: 'link_url', label: 'Link URL', type: 'text', placeholder: 'https://...' },
    { key: 'active', label: 'Active', type: 'checkbox', defaultValue: true },
  ];

  return (
    <CrudTable
      title="Banners"
      endpoint="/banners"
      columns={columns}
      fields={fields}
      emptyMessage="No banners found"
    />
  );
};

export default BannersPage;
