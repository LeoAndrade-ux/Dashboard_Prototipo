import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const Login = ({ handleLogin }) => {
  const API = process.env.REACT_APP_API;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Agrega useNavigate aquí

  const handleLoginClick = () => {
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

    fetch(`${API}/login`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Credenciales inválidas");
        }
        return response.json();
      })
      .then((data) => {
        const token = data.access_token;
        localStorage.setItem("token", token);
        handleLogin();
        Swal.fire({
          icon: "success",
          title: "Bienvenido!!!",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate("/"); // Utiliza el navigate aquí
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
        });
      })
      .finally(() => {
        setLoading(false);
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
      <button onClick={handleLoginClick} disabled={loading}>
        {loading ? "Cargando..." : "Iniciar sesión"}
      </button>
    </div>
  );
};
