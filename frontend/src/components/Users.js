import React, { useState, useEffect, Fragment, useCallback } from "react";
import Swal from "sweetalert2";
import TokenExpiredAlert from "./TokenExpiredAlert";
import { useCookies } from "react-cookie";
import Modal from "react-modal"; // Importa react-modal
Modal.setAppElement('#root')

const API = process.env.REACT_APP_API;

export const Users = ({ handleSessionExpired }) => {
  const [users, setUsers] = useState([]);
  const [cookies, , removeCookie] = useCookies(['access_token_cookie']);
  const token = cookies.access_token_cookie;
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [public_token, setPublicToken] = useState("");
  const [private_token, setPrivateToken] = useState("");
  const [UserName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const getUsers = useCallback(async () => {
    try {
      const resp = await fetch(`${API}/clientes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: 'include'
      });
      if (!resp.ok) {
        throw new Error("No se pudo obtener la lista de usuarios.");
      }
      const data = await resp.json();
      setUsers(data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    }
  }, [token]);

  const handleSubmit = async (e, id, token) => {
    e.preventDefault();
    try {
      const resp = await fetch(`${API}/clientes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: 'include',

        body: JSON.stringify({
          name: name,
          ip: ip,
          public_token: public_token,
          private_token: private_token,
          username: UserName,
          password: password,
        }),
      });

      const data = await resp.json();
      if (data["msg"] === "True") {
        Swal.fire({
          icon: "success",
          title: "Cliente actualizado correctamente",
          showConfirmButton: false,
          timer: 1500,
        });
        closeEditModal();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No se pudo actualizar",
        });
      }
      setName("");
      setIp("");
      setPassword("");
      setPrivateToken("");
      setPublicToken("");
      setUserName("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    }
  };

  useEffect(() => {
    const handleTokenExpiration = () => {
      removeCookie('access_token_cookie', { path: '/' });
      removeCookie('userType', { path: '/' });
      TokenExpiredAlert(handleSessionExpired);
    };
    getUsers();
    const isTokenExpired = () => {
      if (!token) {
        return true;
      }
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const expirationDate = new Date(decodedToken.exp * 1000);
      return expirationDate < new Date();
    };

    if (isTokenExpired()) {
      handleTokenExpiration();
    }
  }, [getUsers, token, handleSessionExpired, removeCookie]);

  const openEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    if (editingUser !== null) {
      setEditingUser(null);
      setIsModalOpen(false);
    }
  };

  return (
    <Fragment>
      <form className="form-inline my-2">
        <input
          className="form-control mr-sm-2"
          type="search"
          placeholder="Search"
        />
      </form>
      <div className="table-responsive">
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
              <th scope="col">Acciones</th> {/* Nueva columna para las acciones */}
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user._id}>
                <th scope="row">{user.name}</th>
                <td>{user.ip}</td>
                <td>{user.public_token}</td>
                <td>{user.private_token}</td>
                <td>{user.username}</td>
                <td>{user.password}</td>
                <td>{user.name_breach}</td>
                <td>{user.type_user}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => openEditModal(user)}
                  >
                    Editar
                  </button>{" "}
                  <button
                    className="btn btn-danger btn-sm"
                  // Aquí puedes agregar una función para eliminar el cliente
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal de edición */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeEditModal} // Cierra el modal cuando se solicita
        contentLabel="Editar Cliente"
        appElement={document.getElementById('root')}
      >
        {/* Contenido del modal */}
        {editingUser && (
          <div>
            <form onSubmit={(e) => handleSubmit(e, editingUser._id, token)}>
              <fieldset>
                <legend>Actualización de Cliente</legend>
                <p>ID: {editingUser._id}</p>
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1" className="form-label mt-4">
                        Nombre del cliente
                      </label>
                      <input type="txt" className="form-control rounded" id="Client_name" aria-describedby="Imput name" placeholder={editingUser.name}
                        onChange={
                          (e) => setName(e.target.value)
                        }
                        value={name}
                        autoFocus />
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="form-group">
                      <label htmlFor="Client_name" className="form-label mt-4">
                        Dirección IP
                      </label>
                      <input type="txt" className="form-control rounded" id="IPAddress" placeholder={editingUser.ip}
                        onChange={
                          (e) => setIp(e.target.value)
                        }
                        value={ip} />
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="form-group">
                      <label htmlFor="IPAddress" className="form-label mt-4">
                        Token Público
                      </label>
                      <input type="txt" className="form-control rounded" id="PublicToken" placeholder={editingUser.public_token}
                        onChange={
                          (e) => setPublicToken(e.target.value)
                        }
                        value={public_token} />
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="form-group">
                      <label htmlFor="PublikToken" className="form-label mt-4">
                        Token Privado
                      </label>
                      <input type="txt" className="form-control rounded" id="PrivateToken" placeholder={editingUser.private_token}
                        onChange={
                          (e) => setPrivateToken(e.target.value)
                        }
                        value={private_token} />
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="form-group">
                      <label htmlFor="PublikToken" className="form-label mt-4">
                        Nombre de Usuario
                      </label>
                      <input type="txt" className="form-control rounded" id="UserName" placeholder={editingUser.username}
                        onChange={
                          (e) => setUserName(e.target.value)
                        }
                        value={UserName} />
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="form-group">
                      <label htmlFor="PublikToken" className="form-label mt-4">
                        Contraseña
                      </label>
                      <input type="password" className="form-control rounded" id="password" placeholder={editingUser.password}
                        onChange={
                          (e) => setPassword(e.target.value)
                        }
                        value={password} />
                    </div>
                  </div>
                </div>
              </fieldset>
              <div className="row">
                <div className="d-grid col-6 pt-3">
                  <button className="btn btn-lg btn-primary rounded-pill" type="submit">
                    Actualizar
                  </button>
                </div>
                <div className="d-grid col-6 pt-3">
                  <button className="btn btn-lg btn-primary rounded-pill" onClick={closeEditModal}>
                    Cancelar
                  </button>
                </div>
              </div>

            </form>
          </div>
        )}
      </Modal>

    </Fragment>
  );
};
