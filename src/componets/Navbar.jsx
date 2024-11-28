import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
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
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="dropdownId"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Dropdown
            </a>
            <div className="dropdown-menu" aria-labelledby="dropdownId">
              <a className="dropdown-item" href="#">
                Action 1
              </a>
              <a className="dropdown-item" href="#">
                Action 2
              </a>
            </div>
          </li>
        </ul>
        <form className="d-flex my-2 my-lg-0">
          <Link className="btn my-2 my-sm-0" id="login-button" to="/Login">
            Log in
          </Link>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
