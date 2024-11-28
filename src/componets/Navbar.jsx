import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase"; // Asegúrate de importar correctamente tu archivo de configuración de Firebase
import "./navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null); // Estado para el usuario autenticado

  useEffect(() => {
    // Comprobar si el usuario está autenticado cuando el componente se monta
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        // Recuperar el displayName si está disponible
        const { displayName } = currentUser;
        setUser({
          name: displayName || "Usuario", // Si no hay nombre, usar un valor por defecto
          email: currentUser.email,
        });
      } else {
        setUser(null);
      }
    });

    // Limpiar el listener al desmontar el componente
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut(); // Cerrar sesión
    setUser(null); // Restablecer el estado del usuario
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark" id="navbar">
      <a className="navbar-brand" href="#">
        Navbar
      </a>
      <button
        className="navbar-toggler d-lg-none"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#collapsibleNavId"
        aria-controls="collapsibleNavId"
        aria-expanded="false"
        aria-label="Toggle navigation"
      ></button>
      <div className="collapse navbar-collapse" id="collapsibleNavId">
        <ul className="navbar-nav me-auto mt-2 mt-lg-0">
          <li className="nav-item">
            <Link className="nav-link" to="/" aria-current="page">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin">
              Link
            </Link>
          </li>
        </ul>
        
        {/* Si el usuario está autenticado, mostramos su nombre y la opción para cerrar sesión */}
        {user ? (
          <ul className="navbar-nav ml-auto">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="dropdownId"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {user.name} {/* Muestra el nombre del usuario */}
              </a>
              <div className="dropdown-menu" aria-labelledby="dropdownId">
                <button className="dropdown-item" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </div>
            </li>
          </ul>
        ) : (
          // Si no hay usuario autenticado, mostramos el botón de login
          <form className="d-flex my-2 my-lg-0">
            <Link className="btn my-2 my-sm-0" id="login-button" to="/Login">
              Log in
            </Link>
          </form>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
