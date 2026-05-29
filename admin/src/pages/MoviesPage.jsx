import React, { useState, useEffect } from 'react';
import CrudTable from './CrudTable';
import { api } from '../config';

const MoviesPage = () => {
  const [interpreters, setInterpreters] = useState([]);
  const [genres, setGenres] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [interpData, genreData, catData] = await Promise.all([
          api.get('/interpreters'),
          api.get('/genres'),
          api.get('/categories'),
        ]);
        const toOptions = (items) =>
          (Array.isArray(items) ? items : items.data || []).map((item) => ({
            value: item.id,
            label: item.name,
          }));
        setInterpreters(toOptions(interpData));
        setGenres(toOptions(genreData));
        setCategories(toOptions(catData));
      } catch (err) {
        console.error('Failed to load options', err);
      }
    };
    fetchOptions();
  }, []);

  const getNameFromId = (id, options) => {
    const match = options.find((o) => String(o.value) === String(id));
    return match ? match.label : id;
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    {
      key: 'interpreter_id',
      label: 'Interpreter',
      render: (val) => getNameFromId(val, interpreters),
    },
    {
      key: 'genre_id',
      label: 'Genre',
      render: (val) => getNameFromId(val, genres),
    },
    {
      key: 'category_id',
      label: 'Category',
      render: (val) => getNameFromId(val, categories),
    },
    { key: 'active', label: 'Active' },
  ];

  const fields = [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Movie title' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'video_url', label: 'Video URL', type: 'text', placeholder: 'https://...' },
    { key: 'poster_url', label: 'Poster URL', type: 'text', placeholder: 'https://...' },
    { key: 'duration', label: 'Duration (min)', type: 'number' },
    {
      key: 'interpreter_id',
      label: 'Interpreter',
      type: 'select',
      options: interpreters,
    },
    {
      key: 'genre_id',
      label: 'Genre',
      type: 'select',
      options: genres,
    },
    {
      key: 'category_id',
      label: 'Category',
      type: 'select',
      options: categories,
    },
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
