import React, { useState, useEffect } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { api } from '../config';

const PAGE_SIZE = 10;

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [movies, setMovies] = useState({});
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [editingReview, setEditingReview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formStatus, setFormStatus] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reviewsData, moviesData, usersData] = await Promise.all([
        api.get('/reviews'),
        api.get('/movies'),
        api.get('/users'),
      ]);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      const movieMap = {};
      (Array.isArray(moviesData) ? moviesData : []).forEach(m => { movieMap[m.id] = m; });
      setMovies(movieMap);
      const userMap = {};
      (Array.isArray(usersData) ? usersData : []).forEach(u => { userMap[u.id] = u; });
      setUsers(userMap);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (review) => {
    setEditingReview(review);
    setFormStatus(review.status || 'pending');
    setShowModal(true);
    setError('');
  };

  const handleSave = async () => {
    try {
      setError('');
      await api.put(`/reviews/${editingReview.id}`, { status: formStatus });
      setShowModal(false);
      setEditingReview(null);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? '#f59e0b' : '#444', fontSize: 16 }}>
          ★
        </span>
      );
    }
    return stars;
  };

  const filtered = reviews.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    return String(r.id).includes(q) || (movies[r.movie_id]?.title || '').toLowerCase().includes(q) || (users[r.user_id]?.name || '').toLowerCase().includes(q);
  });

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div>
      <div className="page-header">
        <h1>Reviews</h1>
        <div className="page-header-actions">
          <div style={{ position: 'relative' }}>
            <input
              className="search-input"
              placeholder="Search..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            />
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3>No reviews found</h3>
          </div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Movie</th>
                  <th>User</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ width: 120 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{movies[r.movie_id]?.title || '—'}</td>
                    <td>{users[r.user_id]?.name || '—'}</td>
                    <td>{renderStars(r.rating)}</td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.comment || '—'}
                    </td>
                    <td>
                      <span className={`badge badge-${r.status === 'approved' ? 'success' : r.status === 'rejected' ? 'danger' : 'warning'}`}>
                        {r.status || 'pending'}
                      </span>
                    </td>
                    <td>{r.created_at ? new Date(r.created_at).toLocaleDateString() : '—'}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(r)} title="Edit Status">
                          <FiEdit2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pageCount > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: 16, borderTop: '1px solid var(--border)' }}>
                {Array.from({ length: pageCount }, (_, i) => (
                  <button
                    key={i}
                    className={`btn ${i === page ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    onClick={() => setPage(i)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Review Status</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>
              Movie: {movies[editingReview?.movie_id]?.title || '—'} | User: {users[editingReview?.user_id]?.name || '—'}
            </p>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16, fontSize: 14 }}>
              Comment: {editingReview?.comment || '—'}
            </p>
            <div className="form-group">
              <label>Status</label>
              <select value={formStatus} onChange={(e) => setFormStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
