import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTrips, deleteTrip } from '../api';
import { FaPlane, FaMapMarkerAlt, FaCalendar, FaTrash, FaPlus, FaCompass } from 'react-icons/fa';

function TripsList() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTrips();
      setTrips(response.data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      if (error.response?.status === 401) {
        setError('Сессия истекла. Пожалуйста, войдите заново.');
      } else {
        setError('Ошибка при загрузке путешествий');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Удалить это путешествие?')) {
      try {
        await deleteTrip(id);
        loadTrips();
      } catch (error) {
        console.error('Ошибка удаления:', error);
        alert('Ошибка при удалении');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Дата не указана';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getTripStatus = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today < start) return { text: '🌅 Предстоит', color: '#0a66c2' };
    if (today > end) return { text: '✅ Завершено', color: '#22c55e' };
    return { text: '🎉 Сейчас в пути', color: '#f97316' };
  };

  const filteredTrips = trips.filter(trip => {
    const today = new Date();
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);

    if (filter === 'upcoming') return today < start;
    if (filter === 'past') return today > end;
    if (filter === 'ongoing') return today >= start && today <= end;
    return true;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка путешествий...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ textAlign: 'center', maxWidth: '450px', margin: '2rem auto' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h3 style={{ color: '#dc2626' }}>{error}</h3>
        <button onClick={loadTrips} className="btn btn-primary" style={{ marginTop: '1rem' }}>Попробовать снова</button>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div>
        <div className="hero-section">
          <div className="hero-content">
            <div className="badge" style={{ background: 'rgba(255,255,255,0.2)', display: 'inline-block', padding: '0.3rem 1rem', borderRadius: '50px', fontSize: '0.7rem', marginBottom: '1rem' }}>✨ НАЧНИТЕ ПЛАНИРОВАТЬ</div>
            <h1 className="hero-title">
              Ваши <span>путешествия</span><br />
              будут здесь
            </h1>
            <p className="hero-subtitle">
              Создайте первое путешествие и добавляйте рейсы, отели, мероприятия и заметки
            </p>
            <div className="feature-list">
              <span className="feature-item">✈️ Рейсы</span>
              <span className="feature-item">🏨 Отели</span>
              <span className="feature-item">🎯 Мероприятия</span>
              <span className="feature-item">📝 Заметки</span>
            </div>
            <Link to="/trip/new" className="hero-button">
              <FaPlus /> Создать первое путешествие
            </Link>
          </div>
        </div>
        <div className="empty-state">
          <div className="empty-icon">✈️</div>
          <h3>У вас пока нет путешествий</h3>
          <p>Создайте первое путешествие и начните планировать!</p>
          <Link to="/trip/new" className="btn btn-primary">
            ✨ Создать путешествие
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero секция */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="badge" style={{ background: 'rgba(255,255,255,0.2)', display: 'inline-block', padding: '0.3rem 1rem', borderRadius: '50px', fontSize: '0.7rem', marginBottom: '1rem' }}>✨ ТВОЙ ТРЕВЕЛ-ПЛАННЕР</div>
          <h1 className="hero-title">
            Создавайте <span>маршруты</span><br />
            с удовольствием
          </h1>
          <p className="hero-subtitle">
            Добавляйте рейсы, отели, мероприятия и заметки — всё в одном месте
          </p>
          <div className="feature-list">
            <span className="feature-item">✈️ Рейсы</span>
            <span className="feature-item">🏨 Отели</span>
            <span className="feature-item">🎯 Мероприятия</span>
            <span className="feature-item">📝 Заметки</span>
          </div>
          <Link to="/trip/new" className="hero-button">
            <FaPlus /> Создать путешествие
          </Link>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">{trips.length}</span>
            <span className="stat-label">путешествий</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {trips.filter(t => new Date(t.start_date) > new Date()).length}
            </span>
            <span className="stat-label">планируется</span>
          </div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="filters-section">
        <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Все</button>
        <button className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`} onClick={() => setFilter('upcoming')}>🌅 Предстоящие</button>
        <button className={`filter-btn ${filter === 'ongoing' ? 'active' : ''}`} onClick={() => setFilter('ongoing')}>🎉 Текущие</button>
        <button className={`filter-btn ${filter === 'past' ? 'active' : ''}`} onClick={() => setFilter('past')}>✅ Завершённые</button>
      </div>

      {/* Сетка карточек */}
      <div className="trips-grid">
        {filteredTrips.map((trip, idx) => {
          const status = getTripStatus(trip.start_date, trip.end_date);
          return (
            <Link to={`/trip/${trip.id}`} key={trip.id} className="trip-card-link">
              <div className="trip-card" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="trip-card-header">
                  <button onClick={(e) => handleDelete(trip.id, e)} className="delete-btn"><FaTrash /></button>
                  <div className="trip-icon">✈️</div>
                </div>
                <div className="trip-card-content">
                  <h3 className="trip-title">{trip.name}</h3>
                  <div className="trip-destination"><FaMapMarkerAlt /> {trip.destination}</div>
                  <div className="trip-dates">
                    <div className="date-item"><FaCalendar className="date-icon" /><div className="date-text"><small>С</small><strong>{formatDate(trip.start_date)}</strong></div></div>
                    <div className="date-arrow">→</div>
                    <div className="date-item"><FaCalendar className="date-icon" /><div className="date-text"><small>По</small><strong>{formatDate(trip.end_date)}</strong></div></div>
                  </div>
                  <div className="trip-status" style={{ background: `${status.color}10`, color: status.color }}>{status.text}</div>
                  <div className="trip-stats">
                    {trip.flights?.length > 0 && <span className="stat-badge">✈️ {trip.flights.length}</span>}
                    {trip.accommodations?.length > 0 && <span className="stat-badge">🏨 {trip.accommodations.length}</span>}
                    {trip.activities?.length > 0 && <span className="stat-badge">🎯 {trip.activities.length}</span>}
                    {trip.notes?.length > 0 && <span className="stat-badge">📝 {trip.notes.length}</span>}
                  </div>
                </div>
                <div className="trip-card-footer"><div className="view-details">Подробнее →</div></div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default TripsList;