import React, { useState, useEffect, Fragment, useCallback } from "react";
import Swal from "sweetalert2";
import TokenExpiredAlert from "./TokenExpiredAlert";

const API = process.env.REACT_APP_API;

export const Breaches = ({ handleSessionExpired }) => {
    const [breaches, setBreaches] = useState([]);
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const token = localStorage.getItem("token");

    const handleInputChange = (event) => {
        event.preventDefault();
        const termino = event.target.value;
        setQuery(termino);
        // Si el término de búsqueda está vacío, restaurar la tabla completa
        if (termino.trim() === "") {
            setSearchResults(breaches);
        } else {
            // Hacer las solicitudes al backend cuando el usuario escriba algo
            buscarResultadosBreaches(termino);
        }
    };

    const buscarResultadosBreaches = async (termino) => {
        // Hacer la solicitud al backend para buscar en la colección de clientes
        const resp = await fetch(`${API}/buscar_breaches?q=${termino}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await resp.json();
        console.log(data)
        setSearchResults(data);
    };

    const getbreachs = useCallback(async () => {
        try {
            const resp = await fetch(`${API}/breaches`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await resp.json();
            setBreaches(data);
            setSearchResults(data); // Mostrar toda la tabla al cargar la página
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "No se pudo consultar!",
            });
        }
    }, [token]);

    useEffect(() => {
        getbreachs();
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
            localStorage.removeItem('token');
            TokenExpiredAlert(handleSessionExpired);

        }
    }, [getbreachs, handleSessionExpired]);

    return (
        <Fragment>
            <form className="form-inline my-2"> {/* Utiliza la clase form-inline para hacer el formulario en línea */}
                <input
                    className="form-control mr-sm-2"
                    type="search"
                    placeholder="Search"
                    onChange={handleInputChange}
                    value={query}
                />
            </form>
            <div className="table-responsive"> {/* Utiliza la clase table-responsive para hacer la tabla responsive */}
                <table className="table table-hover table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Nombre del Modelo</th>
                            <th scope="col">Descripción</th>
                            <th scope="col">Puntaje</th>
                            <th scope="col">IP</th>
                            <th scope="col">Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchResults.map((item) => {
                            try {
                                return (
                                    <tr className="table-secondary" key={item._id}>
                                        <th scope="row">{item._id}</th>
                                        <td>{item.model_name}</td>
                                        <td>{item.description}</td>
                                        <td>{item.score}</td>
                                        <td>{item.ip}</td>
                                        <td>{item.breach_time}</td>
                                    </tr>
                                );
                            } catch (error) {
                                console.error("Error al renderizar fila:", error);
                                return null; // O puedes mostrar un mensaje de error o realizar alguna acción adecuada en caso de error
                            }
                        })}
                    </tbody>
                </table>
            </div>
        </Fragment>
    );
};
