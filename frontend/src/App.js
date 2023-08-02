import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Register } from './components/Register';
import { Breaches } from './components/Breaches';
import { Navbar } from './components/Navbar';
import { Users } from './components/Users';
import { Home } from './components/Home';
import { Login } from './components/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Función para manejar el inicio de sesión exitoso
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    //window.location.reload()
  };

  useEffect(() => {
    // Verifica si existe un token en el almacenamiento local al cargar la aplicación
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>
      <div>
        <Routes>
          {/* Mostrar rutas solo si el usuario ha iniciado sesión */}
          {isLoggedIn ? (
            <>
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Home />} />
              <Route path="/breaches" element={<Breaches />} />
              <Route path="/clients" element={<Users />} />
            </>
          ) : (
            // Redirige a la página de inicio de sesión si el usuario no ha iniciado sesión
            <>
            <Route path="/" element={<Login handleLogin={handleLogin} />} />
            <Route path="/login" element={<Login handleLogin={handleLogin} />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
