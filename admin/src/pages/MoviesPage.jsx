import React from 'react';
import CrudTable from './CrudTable';

const MoviesPage = () => {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    { key: 'interpreter_id', label: 'Interpreter ID' },
    { key: 'active', label: 'Active' },
  ];

  const fields = [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Movie title' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'video_url', label: 'Video URL', type: 'text', placeholder: 'https://...' },
    { key: 'poster_url', label: 'Poster URL', type: 'text', placeholder: 'https://...' },
    { key: 'duration', label: 'Duration (min)', type: 'number' },
    { key: 'interpreter_id', label: 'Interpreter ID', type: 'number' },
    { key: 'genre_id', label: 'Genre ID', type: 'number' },
    { key: 'category_id', label: 'Category ID', type: 'number' },
    { key: 'active', label: 'Active', type: 'checkbox', defaultValue: true },
  ];

  return (
    <CrudTable
      title="Movies"
      endpoint="/movies"
      columns={columns}
      fields={fields}
      emptyMessage="No movies found"
    />
  );
};

export default MoviesPage;
