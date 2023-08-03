import React, { useState } from "react";
import Swal from 'sweetalert2';



export const Login = () => {

  const API = process.env.REACT_APP_API;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
        const token = data.access_token;
        localStorage.setItem('token', token);
        Swal.fire({icon: 'success', title: 'Bienvenido!!!', showConfirmButton: false, timer: 1500})
        window.location.href = '/';
      })
      .catch((error) => {
        // Mostrar alerta con el mensaje de error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
        });
      });
  };

  return (
    <div>
      <h2>Login</h2>
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
