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
    { key: 'type', label: 'Type' },
    { key: 'badge', label: 'Badge' },
    { key: 'description', label: 'Description' },
    { key: 'interpreter', label: 'Interpreter' },
    { key: 'genre', label: 'Genre' },
    { key: 'year', label: 'Year' },
    { key: 'rating', label: 'Rating' },
    { key: 'director', label: 'Director' },
    { key: 'cast', label: 'Cast' },
    { key: 'trailer_url', label: 'Trailer URL' },
    { key: 'featured', label: 'Featured' },
  ];

  const badgeOptions = [
    { value: '', label: '(none)' },
    { value: 'Hot', label: 'Hot' },
    { value: 'Trending Now', label: 'Trending Now' },
    { value: 'Most Popular', label: 'Most Popular' },
    { value: 'Rising Fast', label: 'Rising Fast' },
    { value: 'Top Picks', label: 'Top Picks' },
    { value: 'Fan Favorites', label: 'Fan Favorites' },
    { value: 'Most Watched', label: 'Most Watched' },
    { value: 'Recommended', label: 'Recommended' },
    { value: 'Featured', label: 'Featured' },
    { value: 'Watching Now', label: 'Watching Now' },
    { value: 'Popular This Week', label: 'Popular This Week' },
    { value: 'Just Added', label: 'Just Added' },
    { value: 'New Releases', label: 'New Releases' },
    { value: 'Fresh Content', label: 'Fresh Content' },
    { value: 'Recently Updated', label: 'Recently Updated' },
    { value: 'Latest Movies', label: 'Latest Movies' },
  ];

  const fields = [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Movie title' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'video_url', label: 'Video URL', type: 'text', placeholder: 'https://...' },
    { key: 'video_file', label: 'Upload Video File', type: 'file', accept: 'video/*' },
    { key: 'poster', label: 'Poster URL', type: 'text', placeholder: 'https://...' },
    { key: 'poster_file', label: 'Upload Poster Image', type: 'file', accept: 'image/*' },
    { key: 'year', label: 'Year', type: 'number' },
    { key: 'duration', label: 'Duration (min)', type: 'number' },
    { key: 'rating', label: 'Rating (0-10)', type: 'number' },
    {
      key: 'type',
      label: 'Type',
      type: 'select',
      options: [
        { value: 'Movie', label: 'Movie' },
        { value: 'Season', label: 'Season' },
        { value: 'Episode', label: 'Episode' },
      ],
      defaultValue: 'Movie',
    },
    {
      key: 'badge',
      label: 'Badge',
      type: 'select',
      options: badgeOptions,
    },
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
    { key: 'director', label: 'Director', type: 'text', placeholder: 'Director name' },
    {
      key: 'cast',
      label: 'Cast',
      type: 'textarea',
      placeholder: 'Comma-separated actor names',
    },
    { key: 'trailer_url', label: 'Trailer URL', type: 'text', placeholder: 'https://...' },
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
