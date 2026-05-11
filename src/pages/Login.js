import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaLock, FaEnvelope, FaPlane } from 'react-icons/fa';

function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(loginForm.username, loginForm.password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (registerForm.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setLoading(true);
    setError('');

    const result = await register(registerForm.username, registerForm.email, registerForm.password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <FaPlane className="auth-icon" />
          <h1>Планировщик путешествий</h1>
          <p>{isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}</p>
        </div>

        {error && (
          <div className="auth-error">
            ❌ {error}
          </div>
        )}

        {isLogin ? (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label>
                <FaUser className="input-icon" />
                Имя пользователя
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                required
                placeholder="Введите имя пользователя"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>
                <FaLock className="input-icon" />
                Пароль
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                required
                placeholder="Введите пароль"
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <label>
                <FaUser className="input-icon" />
                Имя пользователя
              </label>
              <input
                type="text"
                value={registerForm.username}
                onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                required
                placeholder="Придумайте имя пользователя"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>
                <FaEnvelope className="input-icon" />
                Email
              </label>
              <input
                type="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                required
                placeholder="Ваш email"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>
                <FaLock className="input-icon" />
                Пароль
              </label>
              <input
                type="password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                required
                placeholder="Придумайте пароль (мин. 6 символов)"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>
                <FaLock className="input-icon" />
                Подтверждение пароля
              </label>
              <input
                type="password"
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                required
                placeholder="Повторите пароль"
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>
        )}

        <div className="auth-switch">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="btn-link"
          >
            {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;