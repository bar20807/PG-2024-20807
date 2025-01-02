import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { storage } from '../../firebaseConfig';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import useLocalStorage from '../../hook/useLocalStorage';

const EditProfile = ({ setAuthenticated }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    country: '',
    password: '',
    repeatPassword: '',
    profileImage: null,
  });
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification, removeNotification] = useLocalStorage(
    'notification',
    null
  );
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);

  // Cargar datos del usuario al montar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.id);

      fetch(`https://megaproyecto-backend-services.vercel.app/api/players/${decodedToken.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setFormData({
              username: data.player.username || '',
              email: data.player.email || '',
              country: data.player.country || 'Guatemala',
              password: '',
              repeatPassword: '',
              profileImage: data.player.profileImage || null,
            });
          } else {
            setError(data.message || 'Failed to load user data');
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching user data:', err);
          setError('Something went wrong. Please try again.');
          setLoading(false);
        });
    }
  }, []);

  // Mostrar notificación después de recargar la página
  useEffect(() => {
    const storedNotification = localStorage.getItem('notification');
    if (storedNotification) {
      setNotification(JSON.parse(storedNotification));
      localStorage.removeItem('notification'); // Limpiar después de usar
    }

    if (notification) {
      const timer = setTimeout(() => {
        removeNotification();
      }, 2000);
      return () => clearTimeout(timer); // Limpieza del temporizador
    }
  }, [notification, removeNotification]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imgRef = storageRef(storage, `images/${file.name}`);
        const snapshot = await uploadBytes(imgRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        setFormData({ ...formData, profileImage: downloadURL });
      } catch (error) {
        console.error('Error uploading image:', error);
        setError('Error uploading image. Please try again.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.repeatPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://megaproyecto-backend-services.vercel.app/api/players/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const originalData = await response.json();

      const sensitiveFieldsChanged =
        formData.username !== originalData.player.username ||
        formData.email !== originalData.player.email ||
        (formData.password && formData.password !== originalData.player.password);

      const updateResponse = await fetch(`https://megaproyecto-backend-services.vercel.app/api/players/update_profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          country: formData.country,
          password: formData.password ? formData.password : undefined,
          profileImage: formData.profileImage,
        }),
      });

      const updateData = await updateResponse.json();

      if (updateResponse.ok) {
        if (sensitiveFieldsChanged) {
          // Mostrar notificación y esperar antes de redirigir
          setNotification({
            message: 'Profile updated. Please log in again.',
            type: 'info',
          });

          localStorage.setItem(
            'notification',
            JSON.stringify({ message: 'Profile updated. Please log in again.', type: 'info' })
          );

          localStorage.removeItem('token');

          // Esperar 2 segundos antes de redirigir
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else {
          localStorage.setItem(
            'notification',
            JSON.stringify({ message: 'Profile updated successfully!', type: 'success' })
          );
          window.location.reload();
        }
      } else {
        setError(updateData.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };


  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://megaproyecto-backend-services.vercel.app/api/players/delete/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setNotification({
          message: 'Account deleted successfully!',
          type: 'success',
        });
        localStorage.setItem(
          'notification',
          JSON.stringify({ message: 'Account deleted successfully!', type: 'success' })
        );
        setAuthenticated(false);
        localStorage.clear();
        window.location.href = '/login';
      } else {
        setError(data.message || 'Failed to delete account');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };

    const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
    };

    const toggleRepeatPasswordVisibility = () => {
      setRepeatPasswordVisible(!repeatPasswordVisible);
    };


    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen bg-brownCardInformation">
          <div className="flex flex-col items-center">
            <img
              src="/static/images/logo_V1.png"
              alt="Loading Logo"
              className="w-32 h-32 animate-spin"
            />
            <p className="text-whiteTextPlatyfa text-xl mt-4">Loading profile data...</p>
          </div>
        </div>
      );
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-brownCardInformation">
      {notification && notification.message && (
      <div
        className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-opacity duration-500 ${
          notification.type === 'success'
            ? 'bg-green-500'
            : notification.type === 'info'
            ? 'bg-blue-500'
            : 'bg-orange-500'
        } text-whiteTextPlatyfa flex items-center gap-2`}
      >
        {notification.type === 'info' && (
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

      <div className="bg-principalCardColor bg-opacity-80 p-8 md:p-12 rounded-lg shadow-xl max-w-4xl w-full">
        <form onSubmit={handleSubmit} className="bg-brown-800 p-10 md:p-12 rounded-lg shadow-lg">
          {error && <p className="text-red-500 mb-6 text-center">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <img
                src={formData.profileImage || '/static/images/user_icon.png'}
                alt="Profile"
                className="h-24 w-24 mb-4 rounded-full object-cover"
              />
              <label className="text-whiteTextPlatyfa font-bold mb-2">Profile image</label>
              <label className="bg-orangePlatyfa text-whiteTextPlatyfa px-4 py-2 rounded-md cursor-pointer">
                Upload new image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
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
            <div className="relative">
              <label className="block text-whiteTextPlatyfa font-bold mb-2">Password</label>
              <input
                type={passwordVisible ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-whiteTextPlatyfa text-brown-800 focus:outline-none"
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
            <div className="relative">
              <label className="block text-whiteTextPlatyfa font-bold mb-2">Repeat Password</label>
              <input
                type={repeatPasswordVisible ? 'text' : 'password'}
                name="repeatPassword"
                value={formData.repeatPassword}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-whiteTextPlatyfa text-brown-800 focus:outline-none"
              />
              <button
                type="button"
                onClick={toggleRepeatPasswordVisibility}
                className="absolute top-[2.8rem] right-3 focus:outline-none"
              >
                <img
                  src={repeatPasswordVisible ? '/static/images/visible.png' : '/static/images/no-visible.png'}
                  alt={repeatPasswordVisible ? 'Hide password' : 'Show password'}
                  className="w-6 h-6"
                />
              </button>
            </div>
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
          </div>
          <div className="mt-8 flex flex-col md:flex-row justify-between gap-4">
            <button
              type="submit"
              className="w-full bg-orangePlatyfa text-whiteTextPlatyfa py-3 px-4 rounded-lg hover:bg-orange-600 transition"
            >
              Update
            </button>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="w-full bg-red-700 text-whiteTextPlatyfa py-3 px-4 rounded-lg hover:bg-orange-600 transition"
            >
              Delete Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
