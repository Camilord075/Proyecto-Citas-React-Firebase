import "../componets/apartadovisual/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h3>DoctorOnTime</h3>
          <p>
            Tu plataforma confiable para gestionar tus citas médicas. Ofrecemos soluciones rápidas y seguras para conectar con especialistas médicos.
          </p>
        </div>
        <div className="footer-section contact">
          <h3>Contáctanos</h3>
          <p>
            <strong>Teléfono:</strong> +57 123 456 7890
          </p>
          <p>
            <strong>Email:</strong> contacto@saludfacil.com
          </p>
          <p>
            <strong>Dirección:</strong> Calle 123 #45-67, Bogotá, Colombia
          </p>
        </div>
        <div className="footer-section links">
          <h3>Enlaces útiles</h3>
          <ul>
            <li><a href="/faq">Preguntas frecuentes</a></li>
            <li><a href="/politicas">Políticas de privacidad</a></li>
            <li><a href="/terminos">Términos y condiciones</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 DoctorOnTime. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
