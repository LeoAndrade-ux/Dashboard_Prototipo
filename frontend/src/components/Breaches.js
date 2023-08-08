import React, { useState, useEffect, Fragment, useCallback } from "react";
import Swal from "sweetalert2";
import TokenExpiredAlert from "./TokenExpiredAlert";
import { useCookies } from 'react-cookie';

const API = process.env.REACT_APP_API;


export const Breaches = ({ handleSessionExpired }) => {
    const [breaches, setBreaches] = useState([]);
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [cookies,,removeCookie] = useCookies(['access_token_cookie','userType'])
    const token =cookies.access_token_cookie;

    const handleInputChange = (event) => {
        event.preventDefault();
        const termino = event.target.value;
        setQuery(termino);
        if (termino.trim() === "") {
            setSearchResults(breaches);
        } else {
            buscarResultadosBreaches(termino);
        }
    };

    const buscarResultadosBreaches = async (termino) => {
        try {
            const resp = await fetch(`${API}/buscar_breaches?q=${termino}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                credentials: 'include'
            });
            const data = await resp.json();
            setSearchResults(data);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "No se pudo consultar!",
            });
        }
    };

    const getbreachs = useCallback(async () => {
        try {
            const resp = await fetch(`${API}/breaches`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                credentials: 'include'
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
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            const expirationDate = new Date(decodedToken.exp * 1000);
            return expirationDate < new Date();
        };

        if (isTokenExpired()) {
            removeCookie('access_token_cookie','', { path: '/'});
            removeCookie('userType', '', { path: '/'});
            TokenExpiredAlert(handleSessionExpired)
        }
    }, [getbreachs, handleSessionExpired, token, removeCookie]);

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
                                return null;
                            }
                        })}
                    </tbody>
                </table>
            </div>
        </Fragment>
    );
};
