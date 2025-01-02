import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children, authenticated }) => {
  if (authenticated) {
    // Redirigir al Home si el usuario ya está autenticado
    return <Navigate to="/" />;
  }
  return children;
};

export default PublicRoute;
