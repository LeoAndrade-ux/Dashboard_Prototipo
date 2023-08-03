import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Navbar = ({ isLoggedIn, handleLogout }) => {
    const [collapsed, setCollapsed] = useState(true);

    const toggleNavbar = () => {
        setCollapsed(!collapsed);
    };

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
                        {isLoggedIn ? (
                            // Mostrar rutas protegidas solo si el usuario ha iniciado sesión
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">
                                        Home
                                    </Link>
                                </li>
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
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">
                                        Registrar
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-secondary my-2 my-sm-0" onClick={handleLogout}>Cerrar Sesión</button>
                                </li>
                            </>
                        ) : (
                            // Mostrar formulario de inicio de sesión si el usuario no ha iniciado sesión
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">
                                    Iniciar sesión
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};