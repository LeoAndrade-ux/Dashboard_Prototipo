import React, { Fragment } from "react";

export const Register = () => (
  <Fragment>
    <form>
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
                className="form-control"
                id="Client_name"
                aria-describedby="Imput name"
                placeholder="Ingrese un nombre"
                required
              />
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="form-group">
              <label
                htmlFor="Client_name"
                className="form-label mt-4"
              >
                Dirección IP
              </label>
              <input
                type="txt"
                className="form-control"
                id=""
                placeholder="0.0.0.0"
                required
              />
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="form-group">
              <label
                htmlFor="IPAddress"
                className="form-label mt-4"
              >
              Token Público
              </label>
              <input
                type="txt"
                className="form-control"
                id=""
                placeholder="Ingrese el token público"
                required
              />
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="form-group">
              <label
                htmlFor="PublikToken"
                className="form-label mt-4"
              >
              Token Privado
              </label>
              <input
                type="txt"
                className="form-control"
                id=""
                placeholder="Ingrese el token privado"
                required
              />
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="form-group">
              <label
                htmlFor="PublikToken"
                className="form-label mt-4"
              >
              Nombre de Usuario
              </label>
              <input
                type="txt"
                className="form-control"
                id=""
                placeholder="Nombre de usuario"
              />
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="form-group">
              <label
                htmlFor="PublikToken"
                className="form-label mt-4"
              >
              Contraseña
              </label>
              <input
                type="password"
                className="form-control"
                id=""
                placeholder="Contraseña"
                required
              />
            </div>
          </div>
        </div>
        <div class="d-grid gap-2">
          <button class="btn btn-lg btn-primary" type="submit">Registrar</button>

        </div>
      </fieldset>
    </form>
  </Fragment>
);
