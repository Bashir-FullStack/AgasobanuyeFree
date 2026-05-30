import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { api } from '../config';

const PAGE_SIZE = 10;

const CrudTable = ({ title, endpoint, columns, fields, emptyMessage }) => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await api.get(endpoint);
      const list = Array.isArray(result) ? result : (result.data || []);
      setData(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    const initial = {};
    fields.forEach((f) => {
      initial[f.key] = f.defaultValue !== undefined ? f.defaultValue : '';
    });
    setForm(initial);
    setEditing(null);
    setShowModal(true);
    setError('');
  };

  const openEdit = (item) => {
    const values = {};
    fields.forEach((f) => {
      if (f.type === 'file') {
        values[f.key] = '';
      } else {
        values[f.key] = item[f.key] !== undefined ? item[f.key] : '';
      }
    });
    setForm(values);
    setEditing(item);
    setShowModal(true);
    setError('');
  };

  const handleSave = async () => {
    try {
      setError('');
      const hasFiles = fields.some(f => f.type === 'file' && form[f.key] instanceof File);

      if (hasFiles) {
        const formData = new FormData();
        fields.forEach(f => {
          const val = form[f.key];
          if (f.type === 'file') {
            if (val instanceof File) {
              formData.append(f.key, val);
            }
          } else {
            formData.append(f.key, val === false || val === 0 ? String(val) : (val || ''));
          }
        });
        if (editing) {
          await api.put(`${endpoint}/${editing.id}`, formData);
        } else {
          await api.post(endpoint, formData);
        }
      } else {
        if (editing) {
          await api.put(`${endpoint}/${editing.id}`, form);
        } else {
          await api.post(endpoint, form);
        }
      }
      setShowModal(false);
      setEditing(null);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`${endpoint}/${id}`);
      setDeleteConfirm(null);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const filtered = data.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return columns.some((col) => {
      const val = item[col.key];
      if (val === null || val === undefined) return false;
      return String(val).toLowerCase().includes(q);
    });
  });

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const renderCell = (item, col) => {
    const val = item[col.key];
    if (col.render) return col.render(val, item);
    if (typeof val === 'boolean') {
      return (
        <span className={`badge ${val ? 'badge-success' : 'badge-danger'}`}>
          {val ? 'Yes' : 'No'}
        </span>
      );
    }
    if (val === null || val === undefined) return '—';
    return String(val);
  };

  return (
    <div>
      <div className="page-header">
        <h1>{title}</h1>
        <div className="page-header-actions">
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="search-input"
              placeholder="Search..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              style={{ paddingLeft: 36 }}
            />
          </div>
          <button className="btn btn-primary" onClick={openAdd}>
            <FiPlus /> Add {title.slice(0, -1)}
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3>{emptyMessage || 'No data found'}</h3>
            <p>Add a new entry to get started.</p>
          </div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                  <th style={{ width: 120 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((item) => (
                  <tr key={item.id}>
                    {columns.map((col) => (
                      <td key={col.key}>{renderCell(item, col)}</td>
                    ))}
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(item)} title="Edit">
                          <FiEdit2 />
                        </button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => setDeleteConfirm(item)} title="Delete">
                          <FiTrash2 />
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
            <h2>{editing ? `Edit ${title.slice(0, -1)}` : `Add ${title.slice(0, -1)}`}</h2>
            {fields.map((f) => (
              <div className={`form-group${f.type === 'checkbox' ? ' checkbox' : ''}`} key={f.key}>
                {f.type === 'checkbox' ? (
                  <>
                    <input
                      type="checkbox"
                      id={`field-${f.key}`}
                      checked={!!form[f.key]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.checked })}
                    />
                    <label htmlFor={`field-${f.key}`}>{f.label}</label>
                  </>
                ) : f.type === 'select' ? (
                  <>
                    <label>{f.label}</label>
                    <select
                      value={form[f.key] || ''}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    >
                      <option value="">Select {f.label}</option>
                      {f.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </>
                ) : f.type === 'file' ? (
                  <>
                    <label>{f.label}</label>
                    <input
                      type="file"
                      accept={f.accept || '*/*'}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.files[0] })}
                    />
                    {editing && (
                      <small style={{ color: 'var(--text-secondary)', display: 'block', marginTop: 4 }}>
                        Leave empty to keep existing {f.label.toLowerCase()}
                      </small>
                    )}
                  </>
                ) : f.type === 'textarea' ? (
                  <>
                    <label>{f.label}</label>
                    <textarea
                      value={form[f.key] || ''}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      rows={3}
                    />
                  </>
                ) : (
                  <>
                    <label>{f.label}</label>
                    <input
                      type={f.type || 'text'}
                      value={form[f.key] || ''}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.placeholder || f.label}
                    />
                  </>
                )}
              </div>
            ))}
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Confirm Delete</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
              Are you sure you want to delete this {title.slice(0, -1).toLowerCase()}? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudTable;
