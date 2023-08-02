import React, { useState, useEffect, Fragment } from "react";
import Swal from "sweetalert2";

const API = process.env.REACT_APP_API;

export const Users = () => {
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem('token');
    
    const getUsers = async () => {
        try {
            const resp = await fetch(`${API}/clientes`, { method: "GET" ,headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            } });
            const data = await resp.json();
            setUsers(data);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "No se pudo consultar!",
            });
        }
    };
    useEffect(() => {
        getUsers();
    },[]);

    return (
        <Fragment>
            <form className="d-flex">
                <input className="form-control me-sm-2" type="search" placeholder="Search" />
                <button className="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
            </form>
            <table className="table table-hover">
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
                <tbody> {
                    users?.map(user => (
                        <tr>
                            <th scope="row">{user.name}</th>
                            <td>{user.ip}</td>
                            <td>{user.public_token}</td>
                            <td>{user.private_token}</td>
                            <td>{user.username}</td>
                            <td>{user.password}</td>
                            <td>{user.name_breach}</td>
                            <td>{user.type_user}</td>
                        </tr>
                    ))
                } </tbody>
            </table>
        </Fragment>
    );
};
