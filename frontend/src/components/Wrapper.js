import React, { useEffect } from 'react';
const API = process.env.REACT_APP_API;


const AuthWrapper = ({ children }) => {
    const token = localStorage.getItem('token');

    useEffect(() => {
        const checkTokenValidity = async () => {
            try {
                const resp = await fetch(`${API}/check_token`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (resp.status === 401) { // Si el token expiró o es inválido
                    alert('Su sesión ha expirado. Será redirigido al inicio de sesión.');
                    window.location.href = '/login'; // Redirigir al inicio de sesión
                }
            } catch (error) {
                // Manejo de errores
            }
        };

        checkTokenValidity();
    }, [token]);

    return <>{children}</>;
};

export default AuthWrapper;
