import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import InterpretersPage from './pages/InterpretersPage';
import GenresPage from './pages/GenresPage';
import CategoriesPage from './pages/CategoriesPage';
import MoviesPage from './pages/MoviesPage';
import BannersPage from './pages/BannersPage';
import BookingsPage from './pages/BookingsPage';
import UsersPage from './pages/UsersPage';
import PromosPage from './pages/PromosPage';
import ReviewsPage from './pages/ReviewsPage';
import SubscribersPage from './pages/SubscribersPage';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="interpreters" element={<InterpretersPage />} />
          <Route path="genres" element={<GenresPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="movies" element={<MoviesPage />} />
          <Route path="banners" element={<BannersPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="promos" element={<PromosPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="subscribers" element={<SubscribersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
