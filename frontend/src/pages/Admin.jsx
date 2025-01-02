import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useInView } from 'react-intersection-observer';
import { storage } from '../../firebaseConfig';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

// Funcionalidad de carga de imágenes y demás lógica...



const Admin = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({ triggerOnce: true });
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const playersPerPage = 10;
  // Estado para los correos promocionales
  const [promoTitle, setPromoTitle] = useState('');
  const [promoContent, setPromoContent] = useState('');
  const [promoImage, setPromoImage] = useState('');
  const [notification, setNotification] = useState(null); // Para notificaciones
  
  // Desaparición automática de la notificación
useEffect(() => {
  if (notification) {
    const timer = setTimeout(() => {
      setNotification(null);
    }, 2000);

    return () => clearTimeout(timer);
  }
}, [notification]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = jwtDecode(token);

      if (!decodedToken.is_admin) {
        alert('Access denied. Admins only.');
        return navigate('/');
      } else {
        setAuthor(decodedToken.username);
      }
    } else {
      return navigate('/login');
    }

    fetch('https://megaproyecto-backend-services.vercel.app/api/admins', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setPlayers(data.players);
        } else {
          console.error('Error fetching players:', data.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching players:', error);
        setLoading(false);
      });
  }, [navigate]);

  // Cálculo de los jugadores actuales
  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;

  // Cambio de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Función para eliminar un jugador
  const handleDeletePlayer = (playerId) => {
    const token = localStorage.getItem('token');

    fetch(`https://megaproyecto-backend-services.vercel.app/api/players/delete/${playerId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('Player status updated successfully');
          setPlayers((prevPlayers) =>
            prevPlayers.map((player) =>
              player.id === playerId ? { ...player, is_deleted: true } : player
            )
          );
        } else {
          alert('Failed to update player status');
        }
      })
      .catch((error) => console.error('Error updating player status:', error));
  };

  // Función para restaurar un jugador
  const handleRestorePlayer = (playerId) => {
    const token = localStorage.getItem('token');

    fetch(`https://megaproyecto-backend-services.vercel.app/api/players/restore`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ playerId }), // Se envía el playerId al backend
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('Player restored successfully');
          setPlayers((prevPlayers) =>
            prevPlayers.map((player) =>
              player.id === playerId ? { ...player, is_deleted: false } : player
            )
          );
        } else {
          alert('Failed to restore player');
        }
      })
      .catch((error) => console.error('Error restoring player:', error));
  };

  // Función para otorgar o revocar estatus de administrador
  const handleToggleAdmin = (playerId, currentStatus) => {
    const token = localStorage.getItem('token');
    const newStatus = !currentStatus; // Cambia el estado actual de administrador

    fetch(`https://megaproyecto-backend-services.vercel.app/api/admins/make_admin/${playerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isAdmin: newStatus }), // Nuevo estado de admin
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('Admin status updated successfully');
          setPlayers((prevPlayers) =>
            prevPlayers.map((player) =>
              player.id === playerId ? { ...player, is_admin: newStatus } : player
            )
          );
        } else {
          alert('Failed to update admin status');
        }
      })
      .catch((error) => console.error('Error updating admin status:', error));
  };

  // Filtrar y paginar jugadores al mismo tiempo
  const filteredPlayers = players
  .filter((player) => player.email.toLowerCase().includes(search.toLowerCase()))
  .slice(indexOfFirstPlayer, indexOfLastPlayer);


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
          <p className="text-whiteTextPlatyfa text-xl mt-4">Loading admin data...</p>
        </div>
      </div>
    );
  }

  const handleImageUpload = async (file) => {
    if (!file) return;
  
    // Referencia a la ubicación en Firebase Storage
    const storageRef2 = storageRef(storage, `images/${file.name}`);
    
    try {
      // Subir el archivo
      const snapshot = await uploadBytes(storageRef2, file);
      console.log('Archivo subido con éxito!');
  
      // Obtener la URL de descarga del archivo
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('URL de la imagen:', downloadURL);
  
      // Guardar la URL en el estado o enviarla a tu API para almacenarla en SQL
      setImage(downloadURL);
  
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  };

  const handleAddNews = async () => {
    const token = localStorage.getItem('token');
  
    if (!image) {
      setNotification({ message: 'Please select an image.', type: 'error' });
      return;
    }
  
    try {
      const file = document.querySelector('input[type="file"]').files[0];
      const storageRef2 = storageRef(storage, `images/${file.name}`);
      const snapshot = await uploadBytes(storageRef2, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
  
      const response = await fetch('https://megaproyecto-backend-services.vercel.app/api/admins/add_new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, author, content, image: downloadURL }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setNotification({ message: 'News added successfully!', type: 'success' });
        setTitle('');
        setContent('');
        setImage('');
      } else {
        setNotification({ message: `Failed to add news: ${data.message}`, type: 'error' });
      }
    } catch (error) {
      console.error('Error adding news:', error);
      setNotification({ message: 'Error adding news.', type: 'error' });
    }
  };
  

  // Función para manejar la carga de la imagen del correo promocional
  const handlePromoImageUpload = async (file) => {
    if (!file) return;
    const storageRef2 = storageRef(storage, `promo_images/${file.name}`);
    try {
      const snapshot = await uploadBytes(storageRef2, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setPromoImage(downloadURL);
    } catch (error) {
      console.error('Error uploading promo image:', error);
    }
  };

  // Función para enviar correos promocionales a los usuarios
  const handleSendPromoEmail = async () => {
    const token = localStorage.getItem('token');
  
    if (!promoImage) {
      setNotification({ message: 'Please select an image for the promotion.', type: 'error' });
      return;
    }
  
    try {
      const response = await fetch('https://megaproyecto-backend-services.vercel.app/api/admins/send_promo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: promoTitle,
          author,
          content: promoContent,
          image: promoImage,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setNotification({ message: 'Promotional email sent successfully!', type: 'success' });
        setPromoTitle('');
        setPromoContent('');
        setPromoImage('');
      } else {
        setNotification({ message: `Failed to send promo: ${data.message}`, type: 'error' });
      }
    } catch (error) {
      console.error('Error sending promo email:', error);
      setNotification({ message: 'Error sending promo email.', type: 'error' });
    }
  };
  

  // Función para determinar las páginas visibles
  const getVisiblePages = (totalPages, currentPage) => {
    const maxVisible = 6; // Número máximo de botones visibles
    const pages = [];

    if (totalPages <= maxVisible) {
      // Si el total de páginas es menor o igual al máximo visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Si el total de páginas excede el máximo visible
      const startPage = Math.max(2, currentPage - 2); // Primera página visible después de la página 1
      const endPage = Math.min(totalPages - 1, currentPage + 2); // Última página visible antes de la última página

      pages.push(1); // Siempre muestra la primera página

      if (startPage > 2) {
        pages.push("..."); // Mostrar "..." antes del rango
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push("..."); // Mostrar "..." después del rango
      }

      pages.push(totalPages); // Siempre muestra la última página
    }

    return pages;
  };

  return (
    <div className="bg-brownCardInformation min-h-screen">
      {notification && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 transition-opacity duration-500 ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
          >
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
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-2 text-xl">
              &times;
            </button>
          </div>
        )}
      <div className="py-8 px-4 sm:px-6 md:px-8 lg:px-20">
        <div
          ref={ref}
          className={`flex flex-col p-4 md:p-6 space-y-6 max-w-screen-xl mx-auto transition-opacity duration-500 ${inView ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="w-full p-4 md:p-6 bg-principalCardColor bg-opacity-80 rounded-lg">
            <h2 className="text-xl md:text-2xl font-bold text-whiteTextPlatyfa mb-4 bg-brownCardInformation text-center rounded-lg p-4 max-w-xs mx-auto opacity-70">
              Admin Panel
            </h2>

            {/* Sección de jugadores */}
            <div className="mb-10">
              <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                <input
                  type="text"
                  placeholder="Search players by email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full md:w-full p-3 rounded-lg bg-whiteTextPlatyfa text-brown-800"
                />
              </div>

              <div className="overflow-x-auto bg-brown-800 p-4 rounded-lg shadow-lg">
                <table className="w-full text-whiteTextPlatyfa">
                  <thead>
                    <tr className="text-center">
                      <th className="py-2 px-4">Email</th>
                      <th className="py-2 px-4">Country</th>
                      <th className="py-2 px-4">Status</th>
                      <th className="py-2 px-4">Admin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlayers.map((player) => (
                      <tr key={player.id} className="text-center">
                        <td className="py-2 px-4">{player.email}</td>
                        <td className="py-2 px-4">{player.country}</td>
                        <td className="py-2 px-4">
                          {player.is_deleted ? (
                            <button
                              className="py-1 px-3 rounded-lg bg-green-600 text-whiteTextPlatyfa hover:bg-green-500 transition"
                              onClick={() => handleRestorePlayer(player.id)}
                            >
                              Restore
                            </button>
                          ) : (
                            <button
                              className="py-1 px-3 rounded-lg bg-red-700 text-whiteTextPlatyfa hover:bg-red-600 transition"
                              onClick={() => handleDeletePlayer(player.id)}
                            >
                              Delete
                            </button>
                          )}
                        </td>
                        <td className="py-2 px-4">
                          <button
                            className={`py-1 px-3 rounded-lg transition ${
                              player.is_admin
                                ? 'bg-yellow-500 text-whiteTextPlatyfa hover:bg-yellow-400'
                                : 'bg-gray-500 text-whiteTextPlatyfa hover:bg-gray-400'
                            }`}
                            onClick={() => handleToggleAdmin(player.id, player.is_admin)}
                          >
                            {player.is_admin ? 'Revoke Admin' : 'Make Admin'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              <div className="flex justify-center mt-4">
                {getVisiblePages(Math.ceil(players.length / playersPerPage), currentPage).map(
                  (page, index) =>
                    page === "..." ? (
                      <span
                        key={index}
                        className="mx-1 px-3 py-1 rounded bg-transparent text-gray-400"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={index}
                        onClick={() => paginate(page)}
                        className={`mx-1 px-3 py-1 rounded ${
                          currentPage === page
                            ? "bg-orangePlatyfa text-white"
                            : "bg-gray-500 text-white"
                        }`}
                      >
                        {page}
                      </button>
                    )
                )}
              </div>;
            </div>

            {/* Línea divisoria */}
            <hr className="my-8 border-t border-brown-600" />

            {/* Sección para añadir noticias */}
            <div className="bg-brown-800 p-8 md:p-12 rounded-lg shadow-xl">
              <h3 className="text-lg md:text-xl font-bold text-whiteTextPlatyfa mb-4 text-center">
                Add News
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddNews();
                }}
                className="space-y-4"
              >
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 rounded-lg bg-whiteTextPlatyfa text-brown-800 focus:outline-none"
                  required
                />
                <textarea
                  placeholder="Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 rounded-lg bg-whiteTextPlatyfa text-brown-800 focus:outline-none"
                  rows="5"
                  required
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                  className="w-full p-3 rounded-lg bg-whiteTextPlatyfa text-brown-800 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-orangePlatyfa text-whiteTextPlatyfa rounded-lg hover:bg-orange-600 transition"
                >
                  Add News
                </button>
              </form>
            </div>
              
            {/* Línea divisoria */}
            <hr className="my-8 border-t border-brown-600" />

            {/* Formulario para enviar correos promocionales */}
            <div className="bg-brown-800 p-8 md:p-12 rounded-lg shadow-xl">
              <h3 className="text-lg md:text-xl font-bold text-whiteTextPlatyfa mb-4 text-center">
                Send Promotional Email
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendPromoEmail();
                }}
                className="space-y-4"
              >
                <input
                  type="text"
                  placeholder="Promotion Title"
                  value={promoTitle}
                  onChange={(e) => setPromoTitle(e.target.value)}
                  className="w-full p-3 rounded-lg bg-whiteTextPlatyfa text-brown-800 focus:outline-none"
                  required
                />
                <textarea
                  placeholder="Promotion Content"
                  value={promoContent}
                  onChange={(e) => setPromoContent(e.target.value)}
                  className="w-full p-3 rounded-lg bg-whiteTextPlatyfa text-brown-800 focus:outline-none"
                  rows="5"
                  required
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePromoImageUpload(e.target.files[0])}
                  className="w-full p-3 rounded-lg bg-whiteTextPlatyfa text-brown-800 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-orangePlatyfa text-whiteTextPlatyfa rounded-lg hover:bg-orange-600 transition"
                >
                  Send Promotion
                </button>
              </form>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
