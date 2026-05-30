import React, { useState, useEffect } from 'react';
import CrudTable from './CrudTable';
import { api } from '../config';

const MoviesPage = () => {
  const [interpreters, setInterpreters] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [interpData, genreData] = await Promise.all([
          api.get('/interpreters'),
          api.get('/genres'),
        ]);
        const toNameOptions = (items) =>
          (Array.isArray(items) ? items : items.data || []).map((item) => ({
            value: item.name,
            label: item.name,
          }));
        setInterpreters(toNameOptions(interpData));
        setGenres(toNameOptions(genreData));
      } catch (err) {
        console.error('Failed to load options', err);
      }
    };
    fetchOptions();
  }, []);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    { key: 'interpreter', label: 'Interpreter' },
    { key: 'genre', label: 'Genre' },
    { key: 'year', label: 'Year' },
    { key: 'rating', label: 'Rating' },
    { key: 'featured', label: 'Featured' },
  ];

  const fields = [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Movie title' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'video_url', label: 'Video URL', type: 'text', placeholder: 'https://...' },
    { key: 'poster', label: 'Poster URL', type: 'text', placeholder: 'https://...' },
    { key: 'year', label: 'Year', type: 'number' },
    { key: 'duration', label: 'Duration (min)', type: 'number' },
    { key: 'rating', label: 'Rating (0-10)', type: 'number' },
    {
      key: 'interpreter',
      label: 'Interpreter',
      type: 'select',
      options: interpreters,
    },
    {
      key: 'genre',
      label: 'Genre',
      type: 'select',
      options: genres,
    },
    { key: 'featured', label: 'Featured', type: 'checkbox', defaultValue: false },
    { key: 'uploader', label: 'Uploader', type: 'text', placeholder: 'Admin' },
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
