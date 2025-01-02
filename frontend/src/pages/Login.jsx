import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Ajusta el import según tu biblioteca
import useLocalStorage from '../../hook/useLocalStorage';

const Login = ({ setAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [notification, setNotification, removeNotification] = useLocalStorage(
    'notification',
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        removeNotification();
      }, 2000);

      return () => clearTimeout(timer); // Limpiar temporizador
    }
  }, [notification, removeNotification]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://megaproyecto-backend-services.vercel.app/api/players/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);

        const decodedToken = jwtDecode(data.token);
        localStorage.setItem('username', decodedToken.username);

        if (!decodedToken.is_deleted) {
          setAuthenticated(true);
          window.location.href = '/'; // Redirige al dashboard
        }
      } else {
        if (data.message === 'Account is deleted' || data.message === 'Cuenta eliminada') {
          localStorage.setItem('token', data.token);
          setAuthenticated(false);
          window.location.href = '/restore';
        } else {
          setError(data.message || 'Login failed');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-brownCardInformation relative">
      {notification && notification.message && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-opacity duration-500 ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-whiteTextPlatyfa`}
        >
          {notification.message}
        </div>
      )}

      <div className="bg-principalCardColor bg-opacity-90 p-8 md:p-12 rounded-lg shadow-xl max-w-4xl w-full">
        <form onSubmit={handleLogin} className="bg-brown-800 p-10 md:p-12 rounded-lg shadow-lg">
          <div className="mb-6">
            <img src="/static/images/logo_V1.png" alt="Logo" className="h-32 mx-auto mb-8" />
          </div>
          {error && <p className="text-red-500 mb-6 text-center">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-whiteTextPlatyfa font-bold mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 rounded-lg bg-whiteTextPlatyfa text-brown-800 focus:outline-none"
                required
              />
            </div>
            <div className="relative">
              <label className="block text-whiteTextPlatyfa font-bold mb-2">Password</label>
              <input
                type={passwordVisible ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-whiteTextPlatyfa text-brownCardInformation focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-[2.8rem] right-3 focus:outline-none"
              >
                <img
                  src={passwordVisible ? '/static/images/visible.png' : '/static/images/no-visible.png'}
                  alt={passwordVisible ? 'Hide password' : 'Show password'}
                  className="w-6 h-6"
                />
              </button>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-4">
            <button
              type="submit"
              className="w-full bg-orangePlatyfa text-whiteTextPlatyfa py-3 px-4 rounded-lg hover:bg-orange-600 transition"
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => navigate('/register')}
              className="w-full bg-orangePlatyfa text-whiteTextPlatyfa py-3 px-4 rounded-lg hover:bg-orange-600 transition"
            >
              Register
            </button>
          </div>
          <div className="mt-4 text-center">
            <button onClick={() => navigate('/forgot_password')} className="text-whiteTextPlatyfa underline">
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
