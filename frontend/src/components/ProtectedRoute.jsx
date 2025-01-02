import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const ProtectedRoute = ({ authenticated, adminOnly, children }) => {
  // Verifica la autenticación en el estado y en el localStorage
  const token = localStorage.getItem('token');
  const isAuth = authenticated || token !== null;
  let isAdmin = false;

  // Verificamos si el usuario es administrador usando el token decodificado
  if (isAuth && token) {
    const decodedToken = jwtDecode(token);
    isAdmin = decodedToken.is_admin;
  }

  if (!isAuth) {
    // Si no está autenticado, redirige al login
    return <Navigate to="/login" replace />;
  }

  // Si la ruta es solo para administradores y el usuario no es administrador, redirige al inicio
  if (adminOnly && !isAdmin) {
    alert("Access denied. Admins only.");
    return <Navigate to="/" replace />;
  }

  // Si está autenticado y tiene los permisos correctos, renderiza el componente hijo
  return children;
};

export default ProtectedRoute;
