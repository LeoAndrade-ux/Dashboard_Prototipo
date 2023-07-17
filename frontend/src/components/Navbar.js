import React, {useState} from "react";
import {Link} from "react-router-dom";

export const Navbar = () => {
    const [collapsed, setCollapsed] = useState(true);


    const toggleNavbar = () => {
        setCollapsed(!collapsed);
    };

    const navClass = collapsed ? "collapse navbar-collapse" : "navbar-collapse";

    return (
        <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
            <div className="container-fluid">
                <img src="/logo.png" alt="logo" className="img-fluid pe-5"/>
                <button className="navbar-toggler" type="button"
                    onClick={toggleNavbar}>
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={navClass}>
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                Home
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
                    </ul>
                </div>
            </div>
        </nav>
    );
};
