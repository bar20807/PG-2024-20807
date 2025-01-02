import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Importar Link para la navegación interna


const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    country: '',
    language: '',
    game_language: '',
  });
  const [consent, setConsent] = useState(false); // Estado para gestionar el consentimiento
  const [notification, setNotification] = useState(null); // Estado para la notificación
  const [loading, setLoading] = useState(false); // Estado de carga
  const navigate = useNavigate();

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };


  const handleRegister = async (e) => {
    e.preventDefault();
    const age = calculateAge(formData.birthDate);
    if (age < 18) {
      setNotification({
        message: 'You must be at least 18 years old to register.',
        type: 'error',
      });
      return;
    }
    if (!consent) {
      setNotification({
        message: 'You must accept the Privacy Policy to register.',
        type: 'error',
      });
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`https://megaproyecto-backend-services.vercel.app/api/players/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem(
          'notification',
          JSON.stringify({ message: 'Registered successfully!', type: 'success' })
        );
        navigate('/login');
      } else {
        setNotification({ message: data.message || 'Registration failed', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setNotification({ message: 'Something went wrong. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleConsentChange = (e) => {
    setConsent(e.target.checked);
  };

  // Pantalla de carga estilizada
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-brownCardInformation">
        <div className="flex flex-col items-center">
          <img
            src="/static/images/logo_V1.png"
            alt="Loading Logo"
            className="w-32 h-32 animate-spin"
          />
          <p className="text-whiteTextPlatyfa text-xl mt-4">Registering your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-brownCardInformation relative">
      {notification && (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-2 transition-opacity duration-500 ${
        notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } text-whiteTextPlatyfa z-50`}
    >
      {notification.type === 'success' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11a1 1 0 112 0v4a1 1 0 01-2 0V7zm1 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10A8 8 0 11.001 10 8 8 0 0118 10zm-9-1a1 1 0 100-2 1 1 0 000 2zm1 4a1 1 0 00-2 0v1a1 1 0 002 0v-1z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {notification.message}
    </div>
  )}
      <div className="bg-principalCardColor bg-opacity-90 p-8 md:p-12 rounded-lg shadow-xl max-w-4xl w-full">
        <form onSubmit={handleRegister} className="bg-brown-800 p-10 md:p-12 rounded-lg shadow-lg">
          <div className="mb-6">
            <img src="/static/images/logo_V1.png" alt="Logo" className="h-32 mx-auto mb-8" />
          </div>

          {/* Organizamos los campos en una cuadrícula (grid layout) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primer columna */}
            <div>
              <label className="block text-whiteTextPlatyfa font-bold mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-whiteTextPlatyfa text-brown-800 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-whiteTextPlatyfa font-bold mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-whiteTextPlatyfa text-brown-800 focus:outline-none"
                required
              />
            </div>

            {/* Segunda columna */}
            <div>
              <label className="block text-whiteTextPlatyfa font-bold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-whiteTextPlatyfa text-brown-800 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-whiteTextPlatyfa font-bold mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-whiteTextPlatyfa text-brown-800 focus:outline-none"
                required
              />
            </div>

            {/* Tercera columna */}
            <div>
              <label className="block text-whiteTextPlatyfa font-bold mb-2">Country</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-whiteTextPlatyfa text-brown-800 focus:outline-none"
                required
              >
                <option value="USA">United States</option>
                <option value="Mexico">Mexico</option>
                <option value="Guatemala">Guatemala</option>
                <option value="El Salvador">El Salvador</option>
                <option value="Honduras">Honduras</option>
                <option value="Nicaragua">Nicaragua</option>
                <option value="Costa Rica">Costa Rica</option>
                <option value="Panama">Panama</option>
                <option value="Colombia">Colombia</option>
                <option value="Venezuela">Venezuela</option>
                <option value="Ecuador">Ecuador</option>
                <option value="Peru">Peru</option>
                <option value="Bolivia">Bolivia</option>
                <option value="Chile">Chile</option>
                <option value="Argentina">Argentina</option>
                <option value="Paraguay">Paraguay</option>
                <option value="Uruguay">Uruguay</option>
              </select>
            </div>

            {/* Campo para "Language" */}
            <div>
              <label className="block text-whiteTextPlatyfa font-bold mb-2">Language</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-whiteTextPlatyfa text-brown-800 focus:outline-none"
                required
              >
                <option value="">Select Language</option>
                <option value="Ingles">English</option>
                <option value="Espanol">Spanish</option>
              </select>
            </div>

            {/* Cuarta columna */}
            {/* Campo para "Game Language" */}
            <div>
              <label className="block text-whiteTextPlatyfa font-bold mb-2">Game Language</label>
              <select
                name="game_language"
                value={formData.game_language}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-whiteTextPlatyfa text-brown-800 focus:outline-none"
                required
              >
                <option value="">Select Game Language</option>
                <option value="Ingles">English</option>
                <option value="Espanol">Spanish</option>
              </select>
            </div>

            <div>
              <label className="block text-whiteTextPlatyfa font-bold mb-2">Birth Date</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-whiteTextPlatyfa text-brown-800 focus:outline-none"
                required
              />
            </div>

          </div>

          {/* Consentimiento Activo */}
          <div className="mt-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={consent}
                onChange={handleConsentChange}
                className="form-checkbox h-5 w-5 text-orangePlatyfa"
              />
              <span className="text-sm md:text-lg text-whiteTextPlatyfa">
                By registering, you agree to our{' '}
                <Link to="/privacy-policy" className="underline text-orangePlatyfa">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="mt-8 w-full bg-orangePlatyfa text-whiteTextPlatyfa py-3 px-4 rounded-lg hover:bg-orange-600 transition"
          >
            Register
          </button>
          {/* Enlace a la política de privacidad */}
          <div className="mt-4 text-center">
            <p className="text-sm text-whiteTextPlatyfa">
              By registering, you agree to our{' '}
              <Link to="/privacy-policy" className="text-orangePlatyfa underline hover:text-orange-600">
              Privacy Policy
              </Link>
              .
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
