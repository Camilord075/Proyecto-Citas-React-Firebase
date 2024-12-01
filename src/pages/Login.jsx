import React, { useState } from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../componets/apartadovisual/login.css";

const Login = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPass, setRegisterPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerLastName, setRegisterLastName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [user, setUser] = useState(null); // Nuevo estado para almacenar la información del usuario
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (registerPass !== confirmPass) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      // Crear usuario en Firebase Authentication
      const userCredential = await auth.createUserWithEmailAndPassword(registerEmail, registerPass);
      
      // Asignar nombre completo
      await userCredential.user.updateProfile({
        displayName: `${registerName} ${registerLastName}`,
      });

      // Asignar el rol 'user' por defecto
      const role = 'user'; 

      // Guardar datos del usuario en Firestore, incluyendo el rol
      await db.collection('Usuarios').doc(userCredential.user.uid).set({
        email: registerEmail,
        name: registerName,
        lastName: registerLastName,
        id: userCredential.user.uid,
        role: role, // Rol asignado
      });

      setSuccessMessage("Cuenta creada exitosamente");
      setRegisterEmail('');
      setRegisterPass('');
      setConfirmPass('');
      setRegisterName('');
      setRegisterLastName('');
      setShowRegisterForm(false);

      // Redirigir a la ruta principal después del registro
      navigate('/'); 

    } catch (err) {
      setError(err.message);
      setSuccessMessage(null);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const userCredential = await auth.signInWithEmailAndPassword(loginEmail, loginPass);

      // Obtener el documento del usuario desde Firestore
      const userDoc = await db.collection('Usuarios').doc(userCredential.user.uid).get();
      const userData = userDoc.data();

      // Obtener el rol del usuario
      const role = userData.role;

      // Guardar la información del usuario y rol en el estado
      setUser({
        name: userCredential.user.displayName || "Usuario",
        role: role, // Guardar el rol del usuario
        email: userCredential.user.email,
      });

      setSuccessMessage("¡Inicio de sesión exitoso!");

      if (rememberMe) {
        localStorage.setItem("user", loginEmail);
      } else {
        localStorage.removeItem("user");
      }

      // Redirigir a la ruta principal después del inicio de sesión
      navigate('/'); 

    } catch (err) {
      setError("Correo o contraseña incorrectos");
    }
  };

  const toggleForm = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowRegisterForm(!showRegisterForm);
      setIsAnimating(false);
      // Limpiar los campos del formulario
      setLoginEmail('');
      setLoginPass('');
      setRegisterEmail('');
      setRegisterPass('');
      setConfirmPass('');
      setRegisterName('');
      setRegisterLastName('');
    }, 300);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>{showRegisterForm ? "Registrarse" : "Iniciar Sesión"}</h2>

        {successMessage && <p className="success">{successMessage}</p>}
        {error && <p className="error">{error}</p>}

        <div className={`form-section ${isAnimating ? "animating" : ""}`}>
          {/* Formulario de inicio de sesión */}
          {!showRegisterForm && (
            <form onSubmit={handleLogin}>
              <input
                type="email"
                className="form-control"
                placeholder="Ingrese su email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
              <input
                type="password"
                className="form-control"
                placeholder="Ingrese su contraseña"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                required
                minLength={6}
              />
              <div className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label>Recuerdame</label>
              </div>
              <button type="submit" className="btn">Acceder</button>
            </form>
          )}

          {/* Formulario de registro */}
          {showRegisterForm && (
            <form onSubmit={handleRegister}>
              <input
                type="text"
                className="form-control"
                placeholder="Nombre"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                required
              />
              <input
                type="text"
                className="form-control"
                placeholder="Apellido"
                value={registerLastName}
                onChange={(e) => setRegisterLastName(e.target.value)}
                required
              />
              <input
                type="email"
                className="form-control"
                placeholder="Correo"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />
              <input
                type="password"
                className="form-control"
                placeholder="Contraseña"
                value={registerPass}
                onChange={(e) => setRegisterPass(e.target.value)}
                required
              />
              <input
                type="password"
                className="form-control"
                placeholder="Confirmar contraseña"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                required
              />

              <button type="submit" className="btn">Registrar</button>
            </form>
          )}
        </div>

        <div className="register-link">
          <span>
            {showRegisterForm ? "¿Ya tienes cuenta? " : "¿No tienes cuenta? "}
            <a href="#" onClick={toggleForm} className="register-link-text">
              {showRegisterForm ? "Iniciar sesión" : "Regístrate"}
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
