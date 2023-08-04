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
  const [userType, setUserType] = useState("");



  // Función para manejar el inicio de sesión exitoso
  const handleLogin = () => {
    setIsLoggedIn(true);
    const token = localStorage.getItem('token');
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    setUserType(decodedToken.type_user);
    localStorage.setItem('userType', decodedToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const handleSessionExpired = () => {
    console.log("Session expired");
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    const userType = localStorage.getItem('userType');
    if (userType) {
      setUserType(userType);
    }

  }, []);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout}  userType={userType}/>
      <div>
        <Routes>
          {/* Mostrar rutas solo si el usuario ha iniciado sesión */}
          {isLoggedIn ? (
            <>
              {userType === "normal" && (
                <>
                  <Route path="/" element={<Home handleSessionExpired={handleSessionExpired} />} />
                  <Route path="/breaches" element={<Breaches handleSessionExpired={handleSessionExpired} />} />
                </>
              )}

              {/* Rutas para usuarios administradores */}
              {userType === "administrador" && (
                <>
                  <Route path="/" element={<Home handleSessionExpired={handleSessionExpired} />} />
                  <Route path="/breaches" element={<Breaches handleSessionExpired={handleSessionExpired} />} />
                  <Route path="/register" element={<Register handleSessionExpired={handleSessionExpired} />} />
                  <Route path="/clients" element={<Users handleSessionExpired={handleSessionExpired} />} />
                </>
              )}
            </>
          ) : (
            // Redirige a la página de inicio de sesión si el usuario no ha iniciado sesión
            <>
              <Route path="/login" element={<Login handleLogin={handleLogin} />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );

}

export default App;
