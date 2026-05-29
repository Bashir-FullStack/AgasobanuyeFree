import React from 'react';
import CrudTable from './CrudTable';

const GenresPage = () => {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'active', label: 'Active' },
  ];

  const fields = [
    { key: 'name', label: 'Name', type: 'text', placeholder: 'Genre name' },
    { key: 'active', label: 'Active', type: 'checkbox', defaultValue: true },
  ];

  return (
    <CrudTable
      title="Genres"
      endpoint="/genres"
      columns={columns}
      fields={fields}
      emptyMessage="No genres found"
    />
  );
};

export default GenresPage;
