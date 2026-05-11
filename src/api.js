import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
});

// Добавляем токен к каждому запросу
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Обработка ошибок
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getTrips = () => API.get('/trips/');
export const getTrip = (id) => API.get(`/trips/${id}`);
export const createTrip = (trip) => API.post('/trips/', trip);
export const deleteTrip = (id) => API.delete(`/trips/${id}`);

export const createFlight = (flight) => API.post('/flights/', flight);
export const deleteFlight = (id) => API.delete(`/flights/${id}`);

export const createAccommodation = (accommodation) => API.post('/accommodations/', accommodation);
export const deleteAccommodation = (id) => API.delete(`/accommodations/${id}`);

export const createActivity = (activity) => API.post('/activities/', activity);
export const deleteActivity = (id) => API.delete(`/activities/${id}`);

export const createNote = (note) => API.post('/notes/', note);
export const deleteNote = (id) => API.delete(`/notes/${id}`);