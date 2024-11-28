import React from "react";
import "../componets/apartadovisual/Inicio.css";

const Inicio = () => {
  return (
    <section id="hero">
      <div className="hero-content">
        <h1>Bienvenido a Salud Fácil</h1>
        <p>
          Nuestro objetivo es brindarte una plataforma simple y confiable para gestionar tus citas médicas. 
          Aquí podrás encontrar información sobre médicos disponibles, especialidades, y mucho más, todo desde la comodidad de tu hogar.
        </p>
        <div className="hero-buttons">
          <a href="/contacto" className="btn-secondary">Contáctanos</a>
        </div>
      </div>
    </section>
  );
};

export default Inicio;
