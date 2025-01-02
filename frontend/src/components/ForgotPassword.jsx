import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://megaproyecto-backend-services.vercel.app/api/players/forgot_password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Solo se redirige si el servidor indica que fue exitoso
        setMessage(data.message || 'An email has been sent if the account exists.');
        setTimeout(() => {
          navigate('/');
        }, 2000); // Espera de 2 segundos antes de redirigir
      } else {
        // Muestra el mensaje de error proporcionado por el servidor
        setMessage(data.message || 'Error sending reset link. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-brownCardInformation border-b-2 border-principalCardColor">
      <div className="bg-principalCardColor bg-opacity-90 p-8 md:p-12 rounded-lg shadow-xl max-w-4xl w-full">
        <form onSubmit={handleForgotPassword} className="bg-brown-800 p-10 md:p-12 rounded-lg shadow-lg">
          <div className="mb-6">
            <img src="/static/images/logo_V1.png" alt="Logo" className="h-32 mx-auto mb-8" />
          </div>
          {message && <p className="text-whiteTextPlatyfa font-bold mb-6 text-center">{message}</p>}
          <div>
            <label className="block text-whiteTextPlatyfa font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-whiteTextPlatyfa text-brown-800 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orangePlatyfa text-whiteTextPlatyfa py-3 px-4 rounded-lg mt-6 hover:bg-orange-600 transition"
          >
            Send Reset Link
          </button>
          <div className="mt-4 text-center">
            <button onClick={() => navigate('/Login')} className="text-whiteTextPlatyfa underline">
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
