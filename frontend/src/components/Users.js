import React, { useState, useEffect, Fragment, useCallback } from "react";
import Swal from "sweetalert2";
import TokenExpiredAlert from "./Wrapper";

const API = process.env.REACT_APP_API;

export const Users = () => {
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem('token');
    const getUsers = useCallback(async () => {
        try {
            const resp = await fetch(`${API}/clientes`, {
                method: "GET", headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await resp.json();
            setUsers(data);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "No se pudo consultar!",
            });
        }
    }, [token]);
    useEffect(() => {
        getUsers();
        const isTokenExpired = () => {
            const token = localStorage.getItem("token");
            if (!token) {
              return true;
            }
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            const expirationDate = new Date(decodedToken.exp * 1000);
            return expirationDate < new Date();
          };
      
          if (isTokenExpired()) {
            // Mostrar la alerta de token caducado utilizando el componente reutilizable
            TokenExpiredAlert();
          }
    },);

    return (
        <Fragment>
            <form className="form-inline my-2"> {/* Utiliza la clase form-inline para hacer el formulario en línea */}
                <input
                    className="form-control mr-sm-2"
                    type="search"
                    placeholder="Search"
                />
            </form>
            <div className="table-responsive"> {/* Utiliza la clase table-responsive para hacer la tabla responsive */}
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
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((user) => (
                            <tr key={user._id}> {/* Asegúrate de agregar un atributo key único al iterar sobre los elementos */}
                                <th scope="row">{user.name}</th>
                                <td>{user.ip}</td>
                                <td>{user.public_token}</td>
                                <td>{user.private_token}</td>
                                <td>{user.username}</td>
                                <td>{user.password}</td>
                                <td>{user.name_breach}</td>
                                <td>{user.type_user}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Fragment>
    );
};
