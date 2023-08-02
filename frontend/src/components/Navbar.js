import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Navbar = ({ isLoggedIn, handleLogout }) => {
    const [collapsed, setCollapsed] = useState(true);
    const [showExpirationAlert, setShowExpirationAlert] = useState(false);


    const toggleNavbar = () => {
        setCollapsed(!collapsed);
    };

    useEffect(() => {
        // Comprueba si hay un token almacenado en localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }

        // Obtiene la fecha de expiración del token
        const tokenExpiration = new Date(parseInt(JSON.parse(atob(token.split('.')[1])).exp) * 1000);

        // Calcula el tiempo restante antes de la expiración del token (en milisegundos)
        const currentTime = new Date();
        const timeRemaining = tokenExpiration.getTime() - currentTime.getTime();

        // Muestra la alerta si el tiempo restante es menor a 5 minutos
        if (timeRemaining <= 5 * 60 * 1000) {
            setShowExpirationAlert(true);
        }

        // Configura un temporizador para verificar periódicamente el tiempo de expiración
        const timer = setInterval(() => {
            const currentTime = new Date();
            const timeRemaining = tokenExpiration.getTime() - currentTime.getTime();

            if (timeRemaining <= 5 * 60 * 1000) {
                setShowExpirationAlert(true);
            }
        }, 1000); // Comprueba cada segundo para actualizar la alerta

        // Limpia el temporizador al desmontar el componente
        return () => clearInterval(timer);
    }, []);



    const navClass = collapsed ? 'collapse navbar-collapse' : 'navbar-collapse';

    return (
        <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
            <div className="container-fluid">
                <img src="/logo.png" alt="logo" className="img-fluid pe-5" />
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={toggleNavbar}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={navClass}>
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                Home
                            </Link>
                        </li>
                        {isLoggedIn && ( // Mostrar rutas protegidas solo si el usuario ha iniciado sesión
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/breaches">
                                        Brechas
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/clients">
                                        Clientes
                                    </Link>
                                </li>
                            </>
                        )}
                        {!isLoggedIn && ( // Mostrar formulario de inicio de sesión si el usuario no ha iniciado sesión
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">
                                    Iniciar sesión
                                </Link>
                            </li>
                        )}
                        {isLoggedIn && ( // Mostrar "Registrar" solo si el usuario ha iniciado sesión
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">
                                        Registrar
                                    </Link>
                                </li>
                                <div className="d-flex">
                                    <button className="btn btn-secondary my-2 my-sm-0" onClick={handleLogout}>Cerrar Sesión</button>
                                </div>
                            </>
                        )}
                        {showExpirationAlert && (
                            <div className="alert alert-warning" role="alert">
                                ¡Su sesión está a punto de expirar! Por favor, inicie sesión nuevamente.
                            </div>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};