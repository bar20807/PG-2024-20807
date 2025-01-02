import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import About from './pages/About';
import News from './pages/News';
import Login from './pages/Login';
import Register from './pages/Register'; 
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import RestoreAccount from './pages/RestoreAccount';
import ProtectedRoute from './components/ProtectedRoute';
import Admin from './pages/Admin';
import AdminStats from './pages/AdminStats';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import PublicRoute from './components/PublicRoute';
import PrivacyPolicy from './pages/PrivacyPolicy';
import { jwtDecode } from 'jwt-decode';


function App() {
  // Inicializa el estado de autenticación con base en el localStorage
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Verifica si hay un token en el localStorage para mantener la autenticación
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      // Verificar si el usuario es administrador
      if (decodedToken.is_admin) {
        setIsAdmin(true);
      }
      else{
        setIsAdmin(false)
      }
      setAuthenticated(true);
    }
  }, []);

  // Función para actualizar el estado de autenticación y guardarlo en el localStorage
  const handleAuthentication = (value) => {
    setAuthenticated(value);
    if (value) {
      localStorage.setItem('authenticated', true);
    } else {
      localStorage.removeItem('authenticated');
    }
  };

  return (
    <Router>
      <Header authenticated={authenticated} setAuthenticated={handleAuthentication} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/news" element={<News />} />
        <Route path="/login" element={<Login setAuthenticated={handleAuthentication} />} />
        <Route path="/restore" element={<RestoreAccount setAuthenticated={handleAuthentication} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        
        {/* Rutas públicas protegidas */}
        <Route
          path="/forgot_password"
          element={
            <PublicRoute authenticated={authenticated}>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset_password/:token"
          element={
            <PublicRoute authenticated={authenticated}>
              <ResetPassword />
            </PublicRoute>
          }
        />

        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute authenticated={authenticated}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute authenticated={authenticated}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update_profile"
          element={
            <ProtectedRoute authenticated={authenticated}>
              <EditProfile setAuthenticated={handleAuthentication} />
            </ProtectedRoute>
          }
        />
        {/* Ruta protegida solo para administradores */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute authenticated={authenticated} adminOnly={true}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-stats"
          element={
            <ProtectedRoute authenticated={authenticated} adminOnly={true}>
              <AdminStats />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
