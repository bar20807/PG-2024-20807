import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const [isTokenValid, setIsTokenValid] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [message, setMessage] = useState('');
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch(`https://megaproyecto-backend-services.vercel.app/api/players/validate_reset_token/${token}`);
        const data = await response.json();
        setIsTokenValid(data.valid);
        if (!data.valid) {
          setMessage(data.message || 'Invalid or expired token.');
        }
      } catch (err) {
        console.error(err);
        setIsTokenValid(false);
        setMessage('Something went wrong. Please try again.');
      }
    };

    validateToken();
  }, [token]);

  if (isTokenValid === false) {
    return <Navigate to="/login" replace />;
  }

  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible(!newPasswordVisible);
  };

  const toggleRepeatPasswordVisibility = () => {
    setRepeatPasswordVisible(!repeatPasswordVisible);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== repeatPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`https://megaproyecto-backend-services.vercel.app/api/players/reset_password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      setMessage(data.message || 'Password has been reset successfully.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-brownCardInformation border-b-2 border-principalCardColor">
      <div className="bg-principalCardColor bg-opacity-90 p-8 md:p-12 rounded-lg shadow-xl max-w-4xl w-full">
        <form onSubmit={handleResetPassword} className="bg-brown-800 p-10 md:p-12 rounded-lg shadow-lg">
          <div className="mb-6">
            <img src="/static/images/logo_V1.png" alt="Logo" className="h-32 mx-auto mb-8" />
          </div>
          {message && <p className="text-whiteTextPlatyfa font-bold mb-6 text-center">{message}</p>}
          {isTokenValid && (
            <>
              <div className="relative">
                <label className="block text-whiteTextPlatyfa font-bold mb-2">New Password</label>
                <input
                  type={newPasswordVisible ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 rounded-lg bg-whiteTextPlatyfa text-brown-800 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={toggleNewPasswordVisibility}
                  className="absolute top-[2.8rem] right-3 focus:outline-none"
                >
                  <img
                    src={newPasswordVisible ? '/static/images/visible.png' : '/static/images/no-visible.png'}
                    alt={newPasswordVisible ? 'Hide password' : 'Show password'}
                    className="w-6 h-6"
                  />
                </button>
              </div>
              <div className="relative mt-4">
                <label className="block text-whiteTextPlatyfa font-bold mb-2">Repeat Password</label>
                <input
                  type={repeatPasswordVisible ? 'text' : 'password'}
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="w-full p-3 rounded-lg bg-whiteTextPlatyfa text-brown-800 focus:outline-none"
                  required
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
              <button
                type="submit"
                className="w-full bg-orangePlatyfa text-whiteTextPlatyfa py-3 px-4 rounded-lg mt-6 hover:bg-orange-600 transition"
              >
                Reset Password
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
