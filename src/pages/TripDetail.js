import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getTrip,
  createFlight, createAccommodation, createActivity, createNote,
  deleteFlight, deleteAccommodation, deleteActivity, deleteNote,
  deleteTrip
} from '../api';
import { FaPlane, FaHotel, FaMapMarkerAlt, FaStickyNote, FaTrash, FaArrowLeft, FaPlus, FaCalendar, FaTimes, FaClock, FaUsers, FaTag, FaMoneyBillWave, FaMapPin, FaPen, FaSave, FaRegCalendarAlt } from 'react-icons/fa';

function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('flights');

  // Состояния для модальных окон
  const [modalOpen, setModalOpen] = useState(null);
  const [modalType, setModalType] = useState(null);

  // Форма для рейсов
  const [flightForm, setFlightForm] = useState({
    flight_number: '',
    airline: '',
    departure_city: '',
    arrival_city: '',
    departure_time: '',
    arrival_time: ''
  });

  // Форма для жилья
  const [accommodationForm, setAccommodationForm] = useState({
    name: '',
    address: '',
    check_in: '',
    check_out: '',
    price_per_night: ''
  });

  // Форма для мероприятий
  const [activityForm, setActivityForm] = useState({
    name: '',
    location: '',
    start_time: '',
    end_time: '',
    notes: ''
  });

  // Форма для заметок
  const [noteForm, setNoteForm] = useState({
    content: ''
  });

  const loadTrip = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTrip(id);
      setTrip(response.data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      if (error.response?.status === 404) {
        setError('Путешествие не найдено');
      } else {
        setError('Ошибка при загрузке данных');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrip();
  }, [id]);

  const handleDeleteTrip = async () => {
    if (window.confirm('Вы уверены, что хотите удалить это путешествие?')) {
      try {
        await deleteTrip(id);
        navigate('/');
      } catch (error) {
        alert('Ошибка при удалении');
      }
    }
  };

  // ========== ОБРАБОТЧИКИ ДОБАВЛЕНИЯ ==========
  const handleAddFlight = async (e) => {
    e.preventDefault();
    try {
      await createFlight({
        ...flightForm,
        trip_id: parseInt(id),
        departure_time: new Date(flightForm.departure_time).toISOString(),
        arrival_time: new Date(flightForm.arrival_time).toISOString()
      });
      setFlightForm({
        flight_number: '', airline: '', departure_city: '', arrival_city: '',
        departure_time: '', arrival_time: ''
      });
      setModalOpen(null);
      setModalType(null);
      loadTrip();
    } catch (error) {
      alert('Ошибка при добавлении рейса');
    }
  };

  const handleAddAccommodation = async (e) => {
    e.preventDefault();
    try {
      await createAccommodation({
        ...accommodationForm,
        trip_id: parseInt(id),
        check_in: new Date(accommodationForm.check_in).toISOString(),
        check_out: new Date(accommodationForm.check_out).toISOString(),
        price_per_night: parseInt(accommodationForm.price_per_night) || null
      });
      setAccommodationForm({
        name: '', address: '', check_in: '', check_out: '', price_per_night: ''
      });
      setModalOpen(null);
      setModalType(null);
      loadTrip();
    } catch (error) {
      alert('Ошибка при добавлении жилья');
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    try {
      await createActivity({
        ...activityForm,
        trip_id: parseInt(id),
        start_time: new Date(activityForm.start_time).toISOString(),
        end_time: activityForm.end_time ? new Date(activityForm.end_time).toISOString() : null
      });
      setActivityForm({
        name: '', location: '', start_time: '', end_time: '', notes: ''
      });
      setModalOpen(null);
      setModalType(null);
      loadTrip();
    } catch (error) {
      alert('Ошибка при добавлении мероприятия');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      await createNote({
        content: noteForm.content,
        trip_id: parseInt(id)
      });
      setNoteForm({ content: '' });
      setModalOpen(null);
      setModalType(null);
      loadTrip();
    } catch (error) {
      alert('Ошибка при добавлении заметки');
    }
  };

  // ========== УДАЛЕНИЕ ==========
  const handleDeleteFlightItem = async (flightId) => {
    if (window.confirm('Удалить этот рейс?')) {
      await deleteFlight(flightId);
      loadTrip();
    }
  };

  const handleDeleteAccommodationItem = async (accId) => {
    if (window.confirm('Удалить это жильё?')) {
      await deleteAccommodation(accId);
      loadTrip();
    }
  };

  const handleDeleteActivityItem = async (actId) => {
    if (window.confirm('Удалить это мероприятие?')) {
      await deleteActivity(actId);
      loadTrip();
    }
  };

  const handleDeleteNoteItem = async (noteId) => {
    if (window.confirm('Удалить эту заметку?')) {
      await deleteNote(noteId);
      loadTrip();
    }
  };

  // ========== ФОРМАТИРОВАНИЕ ==========
  const formatDateTime = (dateString) => {
    if (!dateString) return 'Не указано';
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
    });
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return 'Не указано';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(null);
    setModalType(null);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="loading-spinner"></div>
        <p style={{ marginLeft: '1rem', color: '#64748b' }}>Загрузка...</p>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="card" style={{ textAlign: 'center', maxWidth: '450px', margin: '2rem auto' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h3 style={{ color: '#dc2626' }}>{error || 'Путешествие не найдено'}</h3>
        <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Вернуться к списку
        </button>
      </div>
    );
  }

  const isNewTrip = !trip.flights?.length && !trip.accommodations?.length &&
                    !trip.activities?.length && !trip.notes?.length;

  return (
    <div>
      {/* Модальное окно для добавления */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalType === 'flight' && '✈️ Добавление рейса'}
                {modalType === 'accommodation' && '🏨 Добавление жилья'}
                {modalType === 'activity' && '🎯 Добавление мероприятия'}
                {modalType === 'note' && '📝 Добавление заметки'}
              </h2>
              <button className="modal-close" onClick={closeModal}><FaTimes /></button>
            </div>

            <div className="modal-body">
              {/* Форма рейса */}
              {modalType === 'flight' && (
                <form onSubmit={handleAddFlight}>
                  <div className="form-row">
                    <div className="form-group">
                      <label><FaPlane /> Авиакомпания</label>
                      <input type="text" placeholder="Например: Аэрофлот" value={flightForm.airline} onChange={(e) => setFlightForm({...flightForm, airline: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label><FaTag /> Номер рейса</label>
                      <input type="text" placeholder="Например: SU 1234" value={flightForm.flight_number} onChange={(e) => setFlightForm({...flightForm, flight_number: e.target.value})} required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label><FaMapPin /> Город вылета</label>
                      <input type="text" placeholder="Москва" value={flightForm.departure_city} onChange={(e) => setFlightForm({...flightForm, departure_city: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label><FaMapMarkerAlt /> Город прилёта</label>
                      <input type="text" placeholder="Париж" value={flightForm.arrival_city} onChange={(e) => setFlightForm({...flightForm, arrival_city: e.target.value})} required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label><FaRegCalendarAlt /> Дата и время вылета</label>
                      <input type="datetime-local" value={flightForm.departure_time} onChange={(e) => setFlightForm({...flightForm, departure_time: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label><FaRegCalendarAlt /> Дата и время прилёта</label>
                      <input type="datetime-local" value={flightForm.arrival_time} onChange={(e) => setFlightForm({...flightForm, arrival_time: e.target.value})} required />
                    </div>
                  </div>
                  <div className="modal-buttons">
                    <button type="button" className="btn btn-outline" onClick={closeModal}>Отмена</button>
                    <button type="submit" className="btn btn-primary"><FaSave /> Сохранить рейс</button>
                  </div>
                </form>
              )}

              {/* Форма жилья */}
              {modalType === 'accommodation' && (
                <form onSubmit={handleAddAccommodation}>
                  <div className="form-group">
                    <label><FaHotel /> Название отеля / жилья</label>
                    <input type="text" placeholder="Например: Hilton Paris" value={accommodationForm.name} onChange={(e) => setAccommodationForm({...accommodationForm, name: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label><FaMapPin /> Адрес</label>
                    <input type="text" placeholder="Улица, дом, город" value={accommodationForm.address} onChange={(e) => setAccommodationForm({...accommodationForm, address: e.target.value})} required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label><FaRegCalendarAlt /> Дата заезда</label>
                      <input type="datetime-local" value={accommodationForm.check_in} onChange={(e) => setAccommodationForm({...accommodationForm, check_in: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label><FaRegCalendarAlt /> Дата выезда</label>
                      <input type="datetime-local" value={accommodationForm.check_out} onChange={(e) => setAccommodationForm({...accommodationForm, check_out: e.target.value})} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label><FaMoneyBillWave /> Цена за ночь (₽, необязательно)</label>
                    <input type="number" placeholder="5000" value={accommodationForm.price_per_night} onChange={(e) => setAccommodationForm({...accommodationForm, price_per_night: e.target.value})} />
                  </div>
                  <div className="modal-buttons">
                    <button type="button" className="btn btn-outline" onClick={closeModal}>Отмена</button>
                    <button type="submit" className="btn btn-primary"><FaSave /> Сохранить жильё</button>
                  </div>
                </form>
              )}

              {/* Форма мероприятия */}
              {modalType === 'activity' && (
                <form onSubmit={handleAddActivity}>
                  <div className="form-group">
                    <label><FaMapMarkerAlt /> Название мероприятия</label>
                    <input type="text" placeholder="Например: Экскурсия в Лувр" value={activityForm.name} onChange={(e) => setActivityForm({...activityForm, name: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label><FaMapPin /> Место проведения</label>
                    <input type="text" placeholder="Адрес или название места" value={activityForm.location} onChange={(e) => setActivityForm({...activityForm, location: e.target.value})} required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label><FaClock /> Начало</label>
                      <input type="datetime-local" value={activityForm.start_time} onChange={(e) => setActivityForm({...activityForm, start_time: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label><FaClock /> Конец (необязательно)</label>
                      <input type="datetime-local" value={activityForm.end_time} onChange={(e) => setActivityForm({...activityForm, end_time: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label><FaPen /> Заметки к мероприятию</label>
                    <textarea rows="3" placeholder="Дополнительная информация..." value={activityForm.notes} onChange={(e) => setActivityForm({...activityForm, notes: e.target.value})}></textarea>
                  </div>
                  <div className="modal-buttons">
                    <button type="button" className="btn btn-outline" onClick={closeModal}>Отмена</button>
                    <button type="submit" className="btn btn-primary"><FaSave /> Сохранить мероприятие</button>
                  </div>
                </form>
              )}

              {/* Форма заметки */}
              {modalType === 'note' && (
                <form onSubmit={handleAddNote}>
                  <div className="form-group">
                    <label><FaPen /> Текст заметки</label>
                    <textarea rows="6" placeholder="Ваши заметки о путешествии..." value={noteForm.content} onChange={(e) => setNoteForm({...noteForm, content: e.target.value})} required></textarea>
                  </div>
                  <div className="modal-buttons">
                    <button type="button" className="btn btn-outline" onClick={closeModal}>Отмена</button>
                    <button type="submit" className="btn btn-primary"><FaSave /> Сохранить заметку</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Верхняя панель */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button onClick={() => navigate('/')} className="btn btn-secondary"><FaArrowLeft /> Назад</button>
          <button onClick={loadTrip} className="btn btn-outline">🔄 Обновить</button>
        </div>
        <button onClick={handleDeleteTrip} className="btn btn-danger"><FaTrash /> Удалить</button>
      </div>

      {/* Информация о путешествии */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #0a66c2 0%, #0088cc 100%)', color: 'white', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{trip.name}</h1>
        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', opacity: 0.9 }}>
          <FaMapMarkerAlt /> {trip.destination}
        </p>
        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.9 }}>
          <FaCalendar /> {formatDateOnly(trip.start_date)} — {formatDateOnly(trip.end_date)}
        </p>
      </div>

      {isNewTrip && (
        <div className="card" style={{ textAlign: 'center', background: '#e0f2fe', border: '1px solid #bae6fd' }}>
          <p style={{ fontSize: '1rem', color: '#0369a1' }}>✨ Добро пожаловать! Начните добавлять рейсы, жильё, мероприятия и заметки ✨</p>
        </div>
      )}

      {/* Табы */}
      <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'flights', label: 'Авиарейсы', icon: <FaPlane />, color: '#0a66c2', count: trip.flights?.length },
          { id: 'accommodations', label: 'Жильё', icon: <FaHotel />, color: '#22c55e', count: trip.accommodations?.length },
          { id: 'activities', label: 'Мероприятия', icon: <FaUsers />, color: '#f97316', count: trip.activities?.length },
          { id: 'notes', label: 'Заметки', icon: <FaStickyNote />, color: '#8b5cf6', count: trip.notes?.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? 'tab-button-active' : 'tab-button'}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {tab.icon} {tab.label}
            {tab.count > 0 && <span style={{ background: '#e2e8f0', padding: '0.1rem 0.5rem', borderRadius: '20px', fontSize: '0.7rem' }}>{tab.count}</span>}
          </button>
        ))}
      </div>

      {/* ========== ВКЛАДКА РЕЙСЫ ========== */}
      {activeTab === 'flights' && (
        <div className="card">
          <div className="section-header">
            <h3><FaPlane /> Авиарейсы</h3>
            <button className="btn btn-primary" onClick={() => openModal('flight')}><FaPlus /> Добавить рейс</button>
          </div>
          {trip.flights?.length === 0 && <div className="empty-list">✈️ Нет добавленных рейсов</div>}
          {trip.flights?.map((flight, idx) => (
            <div key={flight.id} className="list-item">
              <div className="item-content">
                <div className="item-title">{flight.airline} — {flight.flight_number}</div>
                <div className="item-route">{flight.departure_city} → {flight.arrival_city}</div>
                <div className="item-time">{formatDateTime(flight.departure_time)} → {formatDateTime(flight.arrival_time)}</div>
              </div>
              <button className="btn-icon btn-danger" onClick={() => handleDeleteFlightItem(flight.id)}><FaTrash /></button>
            </div>
          ))}
        </div>
      )}

      {/* ========== ВКЛАДКА ЖИЛЬЁ ========== */}
      {activeTab === 'accommodations' && (
        <div className="card">
          <div className="section-header">
            <h3><FaHotel /> Места проживания</h3>
            <button className="btn btn-primary" onClick={() => openModal('accommodation')}><FaPlus /> Добавить жильё</button>
          </div>
          {trip.accommodations?.length === 0 && <div className="empty-list">🏨 Нет добавленных мест проживания</div>}
          {trip.accommodations?.map((acc, idx) => (
            <div key={acc.id} className="list-item">
              <div className="item-content">
                <div className="item-title">{acc.name}</div>
                <div className="item-subtitle">📍 {acc.address}</div>
                <div className="item-time">📅 {formatDateTime(acc.check_in)} — {formatDateTime(acc.check_out)}</div>
                {acc.price_per_night && <div className="item-price">💰 {acc.price_per_night} ₽/ночь</div>}
              </div>
              <button className="btn-icon btn-danger" onClick={() => handleDeleteAccommodationItem(acc.id)}><FaTrash /></button>
            </div>
          ))}
        </div>
      )}

      {/* ========== ВКЛАДКА МЕРОПРИЯТИЯ ========== */}
      {activeTab === 'activities' && (
        <div className="card">
          <div className="section-header">
            <h3><FaUsers /> Мероприятия</h3>
            <button className="btn btn-primary" onClick={() => openModal('activity')}><FaPlus /> Добавить мероприятие</button>
          </div>
          {trip.activities?.length === 0 && <div className="empty-list">🎯 Нет добавленных мероприятий</div>}
          {trip.activities?.map((activity, idx) => (
            <div key={activity.id} className="list-item">
              <div className="item-content">
                <div className="item-title">{activity.name}</div>
                <div className="item-subtitle">📍 {activity.location}</div>
                <div className="item-time">🕐 {formatDateTime(activity.start_time)}</div>
                {activity.end_time && <div className="item-time">⏱️ до {formatDateTime(activity.end_time)}</div>}
                {activity.notes && <div className="item-note">📌 {activity.notes}</div>}
              </div>
              <button className="btn-icon btn-danger" onClick={() => handleDeleteActivityItem(activity.id)}><FaTrash /></button>
            </div>
          ))}
        </div>
      )}

      {/* ========== ВКЛАДКА ЗАМЕТКИ ========== */}
      {activeTab === 'notes' && (
        <div className="card">
          <div className="section-header">
            <h3><FaStickyNote /> Заметки</h3>
            <button className="btn btn-primary" onClick={() => openModal('note')}><FaPlus /> Добавить заметку</button>
          </div>
          {trip.notes?.length === 0 && <div className="empty-list">📝 Нет заметок</div>}
          {trip.notes?.map((note, idx) => (
            <div key={note.id} className="list-item note-item">
              <div className="item-content">
                <p className="note-text">{note.content}</p>
                <div className="note-date">{formatDateTime(note.created_at)}</div>
              </div>
              <button className="btn-icon btn-danger" onClick={() => handleDeleteNoteItem(note.id)}><FaTrash /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TripDetail;