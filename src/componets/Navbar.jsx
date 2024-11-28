import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import "./navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {

        const userRef = db.collection("users").doc(currentUser.uid); 
        const doc = await userRef.get();

        if (doc.exists) {
          const userData = doc.data();
          setUser({
            firstName: userData.firstName || "Nombre",
            lastName: userData.lastName || "Apellido",
            email: currentUser.email,
          });
        } else {
          const { displayName } = currentUser;
          if (displayName) {
            const nameParts = displayName.split(" ");
            const firstName = nameParts[0] || "Nombre";
            const lastName = nameParts.slice(1).join(" ") || "Apellido";
            setUser({
              firstName,
              lastName,
              email: currentUser.email,
            });
          } else {
            setUser({
              firstName: "Nombre",
              lastName: "Apellido",
              email: currentUser.email,
            });
          }
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut();
    setUser(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Buscando...");
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark" id="navbar">
      <a className="navbar-brand" href="#">
        DoctorOnTime
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
              Inicio
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin">
              Citas
            </Link>
          </li>
        </ul>

        {user ? (
          <form className="d-flex my-2 my-lg-0" onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Buscar"
              aria-label="Search"
            />
            <button className="btn btn-outline-light my-2 my-sm-0" type="submit">
              Buscar
            </button>
          </form>
        ) : (
          <p className="text-light my-2 my-lg-0"></p>
        )}

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
                {user.firstName} {user.lastName} 
              </a>
              <div className="dropdown-menu" aria-labelledby="dropdownId">
                <button className="dropdown-item" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </div>
            </li>
          </ul>
        ) : (
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
