import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTrip } from '../api';

function CreateTrip() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    start_date: '',
    end_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.destination || !formData.start_date || !formData.end_date) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    if (end < start) {
      setError('Дата окончания не может быть раньше даты начала');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const tripData = {
        name: formData.name,
        destination: formData.destination,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString()
      };

      const response = await createTrip(tripData);
      navigate(`/trip/${response.data.id}`);

    } catch (error) {
      console.error('Ошибка создания:', error);
      setError(error.response?.data?.detail || 'Ошибка при создании путешествия');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ color: '#0f172a', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
        ✈️ Новое путешествие
      </h2>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              padding: '0.75rem',
              borderRadius: '12px',
              marginBottom: '1rem',
              fontSize: '0.85rem'
            }}>
              ❌ {error}
            </div>
          )}

          <div className="form-group">
            <label>🏷️ Название путешествия</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Например: Лето в Европе 2024"
              disabled={loading}
            />
            <small style={{ color: '#64748b', fontSize: '0.7rem', display: 'block', marginTop: '0.25rem' }}>
              Придумайте название для вашего путешествия
            </small>
          </div>

          <div className="form-group">
            <label>📍 Страна или город</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              required
              placeholder="Куда отправляетесь?"
              disabled={loading}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>📅 Дата начала</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>📅 Дата окончания</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div style={{
            backgroundColor: '#f0f9ff',
            padding: '0.8rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            border: '1px solid #bae6fd'
          }}>
            <p style={{ color: '#0369a1', margin: 0, fontSize: '0.8rem', marginBottom: '0.5rem' }}>
              <strong>ℹ️ После создания вы сможете добавить:</strong>
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{ color: '#0369a1', fontSize: '0.8rem' }}>✈️ Рейсы</span>
              <span style={{ color: '#0369a1', fontSize: '0.8rem' }}>🏨 Жилье</span>
              <span style={{ color: '#0369a1', fontSize: '0.8rem' }}>🎯 Мероприятия</span>
              <span style={{ color: '#0369a1', fontSize: '0.8rem' }}>📝 Заметки</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? '⏳ Создание...' : '✨ Создать путешествие'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTrip;