import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Register } from './components/Register';
import { Breaches } from './components/Breaches';
import { Navbar } from './components/Navbar';
import { Users } from './components/Users';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { useCookies } from 'react-cookie'; // Importa la función useCookies de react-cookie

function App() {
  const [cookies, setCookies] = useCookies(['access_token_cookie','userType']); // Utiliza useCookies para acceder a las cookies
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState("");
  // Función para manejar el inicio de sesión exitoso
  const handleLogin = () => {
    setIsLoggedIn(true);
    const token = cookies.access_token_cookie;
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    setUserType(decodedToken.role);
    setCookies('userType',decodedToken.role)
  };

  const handleLogout = () => {
  // Remueve la cookie al hacer logout
    setIsLoggedIn(false);
  };

  const handleSessionExpired = () => {
    console.log("Session expired");
    setIsLoggedIn(false);
  };
  useEffect(() => {
    if (cookies.access_token_cookie) {
      handleLogin();
    }
  });
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
