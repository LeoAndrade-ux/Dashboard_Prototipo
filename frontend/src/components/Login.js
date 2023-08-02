import React, { useState } from "react";



export const Login = () => {

  const API = process.env.REACT_APP_API;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username, password: password }),
    };

    fetch(`${API}/login`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Credenciales inválidas');
        }
        return response.json();
      })
      .then((data) => {
        // Si el inicio de sesión es exitoso, guarda el token en el almacenamiento local o en una cookie
        const token = data.access_token;
        localStorage.setItem('token', token);
        window.location.href='/'
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  return (
    <div>
      <h2>Login</h2>
      {errorMessage && <div>{errorMessage}</div>}
      <input
        type="text"
        placeholder="Nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Iniciar sesión</button>
    </div>
  );


};
