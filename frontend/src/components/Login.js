import React, { useState, useEffect, Fragment } from "react";
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
      Swal.fire({ icon: "success", title: "Bienvenido!!!", showConfirmButton: false, timer: 1500 }).then(() => {
        navigate("/"); // Utiliza el navigate aquí
      });
    }
  }, [cookies.access_token_cookie, handleLogin, navigate]);

  const handleLoginClick = async () => {
    if (!username || !password) {
      Swal.fire({ icon: "error", title: "Error", text: "Por favor, ingrese el nombre de usuario y la contraseña" });
      return;
    }

    setLoading(true);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(
        { username: username, password: password }
      )
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
      Swal.fire({ icon: "error", title: "Error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <section className="h-100 gradient-form"
        style={
          { backgroundColor: '#eee' }
        }>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-xl-10">
              <div className="card rounded-3 text-black">
                <div className="row g-0">
                  <div className="col-lg-6">
                    <div className="card-body p-md-5 mx-md-4">
                      <div className="text-center">
                        <img src="https://pbs.twimg.com/media/FUw6MkEXoAI_2sw?format=jpg&name=large"
                          style={
                            { width: '300px' }
                          }
                          alt="logo" />
                        <h4 className="mt-1 mb-5 pb-1">We are The Radical Team</h4>
                      </div>
                      <form>
                        <p>Please login to your account</p>
                        <div className="form-outline mb-4">
                          <input type="txt" id="form2Example11" className="form-control" placeholder="Nombre de Usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
                          <label className="form-label" htmlFor="form2Example11">Username</label>
                        </div>
                        <div className="form-outline mb-4">
                          <input type="password" id="form2Example22" className="form-control" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
                          <label className="form-label" htmlFor="form2Example22">Password</label>
                        </div>
                        <div className="text-center pt-1 mb-5 pb-1">
                          <button className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3 rounded-pill" type="button" onClick={handleLoginClick} disabled={loading}>
                            {loading ? "Cargando..." : "Iniciar sesión"}</button>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                    <div className="px-3 py-4 p-md-5 mx-md-4">
                      <h4 className="mb-4">We are more than just a company</h4>
                      <p className="small mb-0">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};
