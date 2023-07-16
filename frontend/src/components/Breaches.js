import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const API = process.env.REACT_APP_API;

export const Breaches = () => {
    const [breaches, setBreaches] = useState([]);

    const getbreachs = async () => {
        try {
            const resp = await fetch(`${API}/breaches`, { method: "GET" });
            const data = await resp.json();
            setBreaches(data);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "No se pudo consultar!",
            });
        }
    };
    useEffect(() => {
        getbreachs();
    }, []);

    return (
        <div className="row, col-md-12">
            <table className="table table-hover">
                <thead className="table-dark">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Nombre del Modelo</th>
                        <th scope="col">Descripción</th>
                        <th scope="col">Puntaje</th>
                        <th scope="col">IP</th>
                        <th scope="col">Tiempo de la brecha</th>
                    </tr>
                </thead>
                <tbody>
                    {breaches?.map((breach) => (
                        <tr classname="table-secondary">
                            <th scope="row">{breach._id}</th>
                            <td>{breach.model_name}</td>
                            <td>{breach.description}</td>
                            <td>{breach.score}</td>
                            <td>{breach.ip}</td>
                            <td>{breach.breach_time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
