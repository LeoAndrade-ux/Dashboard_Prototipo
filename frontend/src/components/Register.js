import React, {Fragment, useState} from "react";

export const Register = () => {

  const [name, setName] = useState('')
  const [ip , setIp] = useState('')
  const [public_token, setPublicToken] = useState('')
  const [private_token, setPrivateToken] = useState('')
  const [UserName, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
    
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Registro de Cliente</legend>
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="form-group">
                <label htmlFor="exampleInputEmail1" className="form-label mt-4">
                  Nombre del cliente
                </label>
                <input
                  type="txt"
                  className="form-control rounded"
                  id="Client_name"
                  aria-describedby="Imput name"
                  placeholder="Ingrese un nombre"
                  required
                  onChange={(e) => setName(e.target.value)}
                  value = {name}
                  autoFocus
                />
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="form-group">
                <label htmlFor="Client_name" className="form-label mt-4">
                  Dirección IP
                </label>
                <input
                  type="txt"
                  className="form-control rounded"
                  id="IPAddress"
                  placeholder="0.0.0.0"
                  required
                  onChange={(e) => setIp(e.target.value)}
                  value = {ip}
                />
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="form-group">
                <label htmlFor="IPAddress" className="form-label mt-4">
                  Token Público
                </label>
                <input
                  type="txt"
                  className="form-control rounded"
                  id="PublicToken"
                  placeholder="Ingrese el token público"
                  required
                  onChange={(e) => setPublicToken(e.target.value)}
                  value = {public_token}
                />
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="form-group">
                <label htmlFor="PublikToken" className="form-label mt-4">
                  Token Privado
                </label>
                <input
                  type="txt"
                  className="form-control rounded"
                  id="PrivateToken"
                  placeholder="Ingrese el token privado"
                  required
                  onChange={(e) => setPrivateToken(e.target.value)}
                  value = {private_token}
                />
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="form-group">
                <label htmlFor="PublikToken" className="form-label mt-4">
                  Nombre de Usuario
                </label>
                <input
                  type="txt"
                  className="form-control rounded"
                  id="UserName"
                  placeholder="Nombre de usuario"
                  onChange={(e) => setUserName(e.target.value)}
                  value = {UserName}
                />
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="form-group">
                <label htmlFor="PublikToken" className="form-label mt-4">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="form-control rounded"
                  id="password"
                  placeholder="Contraseña"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  value = {password}
                />
              </div>
            </div>
          </div>
        </fieldset>
        <div className="d-grid gap-2 col-6 mx-auto pt-3">
          <button className=" btn btn-lg btn-primary rounded-pill" type="submit">
            Registrar
          </button>
        </div>
      </form>
    </Fragment>
  );
};
