import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const Header = ({ authenticated, setAuthenticated, isAdmin, setIsAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState('/static/images/user_icon.png'); // Imagen de usuario por defecto
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);

      const currentTime = Date.now() / 1000; // Tiempo actual en segundos
      if (decodedToken.exp < currentTime) {
        handleLogout();
        return;
      }

      setUsername(decodedToken.username);

      if (decodedToken.is_admin) {
        setIsAdmin(true);
      }

      if (!decodedToken.is_deleted) {
        setAuthenticated(true);
        fetchProfileImage(decodedToken.id);
      } else {
        setAuthenticated(false);
      }
    } else {
      setAuthenticated(false);
    }
  }, [setAuthenticated]);

  const fetchProfileImage = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://megaproyecto-backend-services.vercel.app/api/players/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok && data.player.profile_image) {
        setProfileImage(data.player.profile_image);
      }
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthenticated(false);
    setUsername('');
    setIsAdmin(false);
    navigate('/'); // Redirige al inicio
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <header className="flex justify-between items-center p-4 bg-brownCardInformation z-20 relative border-b-4 border-principalCardColor">
      {/* Logo y Navegación en pantallas grandes */}
      <div className="flex items-center">
        {/* Logotipo con redirección al inicio */}
        <Link to="/">
          <img src="/static/images/logo_V1.png" alt="Logo" className="w-12 cursor-pointer" />
        </Link>

        {/* Menú de navegación visible solo en pantallas grandes */}
        <nav className="hidden md:flex ml-8">
          <ul className="flex space-x-4 text-whiteTextPlatyfa font-bold">
            <li><Link to="/" className="hover:text-orangePlatyfa">Home</Link></li>
            <li><Link to="/about" className="hover:text-orangePlatyfa">About</Link></li>
            <li><Link to="/news" className="hover:text-orangePlatyfa">News</Link></li>
            {authenticated && <li><Link to="/dashboard" className="hover:text-orangePlatyfa">Dashboard</Link></li>}
            {isAdmin && authenticated && <li><Link to="/admin" className="hover:text-orangePlatyfa">Admin</Link></li>}
            {isAdmin && authenticated && <li><Link to="/admin-stats" className="hover:text-orangePlatyfa">Admin Stats</Link></li>}
          </ul>
        </nav>
      </div>

      {/* Icono de usuario visible solo en pantallas grandes */}
      <div className="md:block hidden">
        {authenticated ? (
          <div className="flex items-center space-x-4">
            <div onClick={() => navigate('/profile')} className="cursor-pointer">
              <img src={profileImage} alt="User Icon" className="h-12 w-12 rounded-full object-cover ring-2 ring-principalCardColor" />
            </div>
          </div>
        ) : (
          <Link to="/login" className="text-whiteTextPlatyfa">
            <img src="/static/images/user_icon.png" alt="User Icon" className="h-10 w-10 rounded-full object-cover" />
          </Link>
        )}
      </div>

      {/* Ícono de menú hamburguesa/cerrar visible solo en pantallas pequeñas */}
      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-white">
          {isOpen ? (
            <img src="/static/images/close_icon.png" alt="Close Icon" className="h-8 w-8 ring-2 ring-principalCardColor" />
          ) : (
            <img src="/static/images/menu-icon.png" alt="Menu Icon" className="h-8 w-8 ring-2 ring-principalCardColor" />
          )}
        </button>
      </div>

      {/* Dropdown Menu visible solo en pantallas pequeñas */}
      {isOpen && (
        <div ref={dropdownRef} className="absolute top-16 left-0 bg-brownCardInformation text-whiteTextPlatyfa font-bold w-full md:hidden">
          <ul className="flex flex-col items-center space-y-4 p-4">
            <li><Link to="/" onClick={() => setIsOpen(false)} className="hover:text-orangePlatyfa">Home</Link></li>
            <li><Link to="/about" onClick={() => setIsOpen(false)} className="hover:text-orangePlatyfa">About</Link></li>
            <li><Link to="/news" onClick={() => setIsOpen(false)} className="hover:text-orangePlatyfa">News</Link></li>
            {authenticated && <li><Link to="/dashboard" onClick={() => setIsOpen(false)} className="hover:text-orangePlatyfa">Dashboard</Link></li>}
            {isAdmin && authenticated && <li><Link to="/admin" onClick={() => setIsOpen(false)} className="hover:text-orangePlatyfa">Admin</Link></li>}
            {isAdmin && authenticated && <li><Link to="/admin-stats" onClick={() => setIsOpen(false)} className="hover:text-orangePlatyfa">Admin Stats</Link></li>}
            {!authenticated && <li><Link to="/login" onClick={() => setIsOpen(false)} className="hover:text-orangePlatyfa">Login</Link></li>}
            {authenticated && <li><Link to="/profile" onClick={() => setIsOpen(false)} className="hover:text-orangePlatyfa">Profile</Link></li>}
            {authenticated && <li><Link onClick={handleLogout} className="hover:text-orangePlatyfa">Logout</Link></li>}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
