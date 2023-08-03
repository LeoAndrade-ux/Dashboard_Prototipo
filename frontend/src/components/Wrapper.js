//import React from "react";
import Swal from "sweetalert2";

const TokenExpiredAlert = () => {
  const handleAccept = () => {
    // Redirección a la pantalla de inicio de sesión
    window.location.href = "/login";
  };

  return Swal.fire({
    title: "Sesión caducada",
    text: "Su sesión ha caducado. Por favor, inicie sesión nuevamente.",
    icon: "warning",
    showCancelButton: false,
    confirmButtonText: "Aceptar",
  }).then(handleAccept);
};

export default TokenExpiredAlert;