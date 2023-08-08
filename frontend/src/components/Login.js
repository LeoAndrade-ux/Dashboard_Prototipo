import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie"; // Importa la función useCookies de react-cookie

export const Login = ({ handleLogin }) => {
  const API = process.env.REACT_APP_API;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["access_token_cookie"]); // Utiliza useCookies para acceder a las cookies

  useEffect(() => {
    if (cookies.access_token_cookie) {
      handleLogin();
      Swal.fire({
        icon: "success",
        title: "Bienvenido!!!",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/"); // Utiliza el navigate aquí
      });
    }
  }, [cookies.access_token_cookie, handleLogin, navigate]);

  const handleLoginClick = async () => {
    if (!username || !password) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, ingrese el nombre de usuario y la contraseña",
      });
      return;
    }

    setLoading(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    };

    try {
      const response = await fetch(`${API}/login`, requestOptions);
      if (!response.ok) {
        throw new Error("Credenciales inválidas");
      }
      const data = await response.json();
      const token = data.access_token_cookie;
      setCookie('access_token_cookie', token);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
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
      <button onClick={handleLoginClick} disabled={loading}>
        {loading ? "Cargando..." : "Iniciar sesión"}
      </button>
    </div>
  );
};
