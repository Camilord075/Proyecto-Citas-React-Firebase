import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import "./navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");  // Término de búsqueda
  const [searchResults, setSearchResults] = useState([]);  // Resultados de búsqueda

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

  const handleSearch = async (e) => {
    e.preventDefault();

    // Si no hay término de búsqueda, no hacer nada
    if (!searchTerm.trim()) return;

    try {
      const citasRef = db.collection("Citas");

      // Realizar la consulta por especialidad
      const snapshot = await citasRef
        .where("available", "==", true)  // Solo buscar citas disponibles
        .where("specialty", "==", searchTerm)  // Buscar por especialidad
        .get();

      // Si no se encuentran citas por especialidad, buscar por doctor
      if (snapshot.empty) {
        const snapshotByDoctor = await citasRef
          .where("available", "==", true)  // Solo buscar citas disponibles
          .where("doctorName", "==", searchTerm)  // Buscar por doctor
          .get();

        if (!snapshotByDoctor.empty) {
          const results = snapshotByDoctor.docs.map(doc => doc.data());
          console.log(results)
          setSearchResults(results);  // Mostrar resultados por doctor
        } else {
          setSearchResults([]);  // No se encontraron citas disponibles
          console.log('No se encontraron citas disponibles')
        }
      } else {
        const results = snapshot.docs.map(doc => doc.data());
        setSearchResults(results);  // Mostrar resultados por especialidad
      }
    } catch (error) {
      console.error("Error al realizar la búsqueda: ", error.message);
      setSearchResults([]);  // En caso de error, mostrar un arreglo vacío
    }
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark" id="navbar">
      <div id="encapsule-navbar">
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
                  placeholder="Buscar por especialidad o doctor"
                  aria-label="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}  // Control de input
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

          {/* Mostrar resultados de búsqueda debajo del campo de búsqueda */}
          {searchResults.length > 0 ? (
            <div className="search-results">
              <ul>
                {searchTerm ? searchResults.map((cita, index) => (
                  <li key={index}>
                    <h5>{cita.specialty} - {cita.doctorName}</h5>
                    <p>Fecha: {cita.schedule}</p>
                    { searchResults.length > 1 ? <hr /> : ""  }
                  </li>
                )) : "No se ha encontrado ningún resultado"}
              </ul>
            </div>
          ) : ""}
      </div>
    </nav>
  );
};

export default Navbar;
