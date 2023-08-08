import React, { useState, useEffect, Fragment, useCallback } from "react";
import Swal from "sweetalert2";
import TokenExpiredAlert from "./TokenExpiredAlert";
import { useCookies } from "react-cookie";

const API = process.env.REACT_APP_API;

export const Users = ({ handleSessionExpired }) => {
  const [users, setUsers] = useState([]);
  const [cookies, , removeCookie] = useCookies(['access_token_cookie']);
  const token = cookies.access_token_cookie;

  const getUsers = useCallback(async () => {
    try {
      const resp = await fetch(`${API}/clientes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: 'include'
      });
      if (!resp.ok) {
        throw new Error("No se pudo obtener la lista de usuarios.");
      }
      const data = await resp.json();
      setUsers(data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    }
  }, [token]);

  useEffect(() => {
    getUsers();
    const isTokenExpired = () => {
      const token = cookies.access_token_cookie;
      if (!token) {
        return true;
      }
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const expirationDate = new Date(decodedToken.exp * 1000);
      return expirationDate < new Date();
    };

    if (isTokenExpired()) {
      removeCookie('access_token','', { path: '/'});
      removeCookie('userType', '', { path: '/'});
      TokenExpiredAlert(handleSessionExpired);
    }
  }, [getUsers, handleSessionExpired, cookies.access_token_cookie, removeCookie]);

  return (
    <Fragment>
      <form className="form-inline my-2">
        <input
          className="form-control mr-sm-2"
          type="search"
          placeholder="Search"
        />
      </form>
      <div className="table-responsive">
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th scope="col">Cliente</th>
              <th scope="col">IP</th>
              <th scope="col">public_token</th>
              <th scope="col">private_token</th>
              <th scope="col">Nombre de Usuario</th>
              <th scope="col">Contraseña</th>
              <th scope="col">Nombre de la brecha</th>
              <th scope="col">Privilegio</th>
              <th scope="col">Acciones</th> {/* Nueva columna para las acciones */}
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user._id}>
                <th scope="row">{user.name}</th>
                <td>{user.ip}</td>
                <td>{user.public_token}</td>
                <td>{user.private_token}</td>
                <td>{user.username}</td>
                <td>{user.password}</td>
                <td>{user.name_breach}</td>
                <td>{user.type_user}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                  // Aquí puedes agregar una función para editar el cliente
                  >
                    Editar
                  </button>{" "}
                  <button
                    className="btn btn-danger btn-sm"
                  // Aquí puedes agregar una función para eliminar el cliente
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};
