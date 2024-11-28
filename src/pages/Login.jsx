import React, { useState } from "react";
import { auth } from "../firebase"; 
import "../componets/apartadovisual/login.css";

const Login = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {

      await auth.signInWithEmailAndPassword(email, pass);
      

      console.log("Inicio de sesión exitoso");


      if (rememberMe) {
        localStorage.setItem("user", email);
      } else {
        localStorage.removeItem("user");
      }

    } catch (err) {
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Iniciar Sesión</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="form-control"
            placeholder="Ingrese su email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="form-control"
            placeholder="Ingrese su contraseña"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
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
        <div className="register-link">
          <span>¿No tienes cuenta? <a href="/Registro" className="register-link-text">Regístrate</a></span>
        </div>
      </div>
    </div>
  );
};

export default Login;
