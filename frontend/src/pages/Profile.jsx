import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const decodedToken = jwtDecode(token);

    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://megaproyecto-backend-services.vercel.app/api/players/${decodedToken.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setUserData(data.player);
        } else {
          console.error(data.message || 'Failed to fetch user data');
          navigate('/login');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-brownCardInformation">
        <div className="flex flex-col items-center">
          {/* Logo girando */}
          <img
            src="/static/images/logo_V1.png"
            alt="Loading Logo"
            className="w-32 h-32 animate-spin"
          />
          {/* Texto de carga */}
          <p className="text-whiteTextPlatyfa text-xl mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-brownCardInformation border-b-2 border-principalCardColor">
      <div className="bg-principalCardColor bg-opacity-90 p-8 md:p-12 rounded-lg shadow-xl max-w-4xl w-full">
        <form className="bg-brown-800 p-10 md:p-12 rounded-lg shadow-lg">
          {/* Encabezado con la imagen de perfil y el nombre de usuario */}
          <div className="mb-6 text-center">
            <img
              src={userData?.profile_image || '/static/images/user_icon.png'}
              alt="User Icon"
              className="h-32 w-32 mx-auto mb-6 rounded-full object-cover ring-4 ring-principalCardColor"
            />
            <h2 className="text-whiteTextPlatyfa text-3xl mb-4">@{userData?.username}</h2>
          </div>

          {/* Botones en un grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              type="button"
              className="w-full bg-orangePlatyfa text-whiteTextPlatyfa py-3 px-4 rounded-lg hover:bg-orange-600 transition"
              onClick={() => navigate('/update_profile')}
            >
              Edit Profile
            </button>
            <button
              type="button"
              className="w-full bg-orangePlatyfa text-whiteTextPlatyfa py-3 px-4 rounded-lg hover:bg-orange-600 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;