import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';
import TripsList from './pages/TripsList';
import TripDetail from './pages/TripDetail';
import CreateTrip from './pages/CreateTrip';
import Login from './pages/Login';

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-container"><div className="loading-spinner"></div><div className="loading-text">Загрузка...</div></div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppContent() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>
            ✈️ Travel Planner
            <span>Планируй с удовольствием</span>
          </h1>
          {isAuthenticated && (
            <div className="header-user">
              <span className="user-name">👤 {user?.username}</span>
              <button onClick={logout} className="btn-logout">Выйти</button>
            </div>
          )}
        </div>
      </header>
      <main className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <TripsList />
            </PrivateRoute>
          } />
          <Route path="/trip/new" element={
            <PrivateRoute>
              <CreateTrip />
            </PrivateRoute>
          } />
          <Route path="/trip/:id" element={
            <PrivateRoute>
              <TripDetail />
            </PrivateRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;