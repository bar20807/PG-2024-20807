import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const RestoreAccount = ({setAuthenticated}) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userID, setUserId] = useState('');

  // Decodificar el token actual para obtener el userID
  useEffect(() => {
    setAuthenticated(false)
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.id);
    }
  }, [setAuthenticated]);

  const handleRestore = async () => {
    try {
      console.log("SOY EL", userID);
      const token = localStorage.getItem('token');
      const response = await fetch(`https://megaproyecto-backend-services.vercel.app/api/players/restore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Nuevo token:", data.token);

      if (response.ok) {
        // Mostrar el mensaje de éxito
        setSuccess('Account restored successfully');
        // Redirigir al login después de restaurar
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message || 'Failed to restore account');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-brownCardInformation">
      <div className="bg-principalCardColor bg-opacity-90 p-8 md:p-12 rounded-lg shadow-xl max-w-4xl w-full">
        <div className="bg-brown-800 p-10 md:p-12 rounded-lg shadow-lg">
          <h2 className="text-whiteTextPlatyfa text-3xl mb-6 text-center">Restore Account</h2>

          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          {success && <p className="text-green-600 text-center mb-4">{success}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <button
                onClick={handleRestore}
                className="w-full bg-orangePlatyfa text-whiteTextPlatyfa py-3 px-4 rounded-lg hover:bg-orange-600 transition"
              >
                Restore Account
              </button>
            </div>

            <div>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-orangePlatyfa text-whiteTextPlatyfa py-3 px-4 rounded-lg hover:bg-orange-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestoreAccount;
