import React, { useState, useEffect } from "react";
import "../componets/apartadovisual/admin.css";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [doctorName, setDoctorName] = useState("");
  const [doctorSpecialty, setDoctorSpecialty] = useState("");
  const [doctorHours, setDoctorHours] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [userAppointments, setUserAppointments] = useState([]);
  const [editingDoctor, setEditingDoctor] = useState(null); // Estado para editar doctor
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await db.collection("Usuarios").doc(currentUser.uid).get();
          const userData = userDoc.data();
          setUser({
            name: currentUser.displayName || "Usuario",
            role: userData.role,
            email: currentUser.email,
          });

          // Si el usuario está logueado, obtenemos las citas reservadas para él
          const appointmentsSnapshot = await db.collection("CitasReservadas")
            .where("userId", "==", currentUser.uid)
            .get();

          // Traemos la información del doctor para cada cita reservada
          const appointmentsList = [];
          for (const doc of appointmentsSnapshot.docs) {
            const appointmentData = doc.data();
            const doctorDoc = await db.collection("Citas").doc(appointmentData.doctorId).get();
            const doctorData = doctorDoc.data();
            appointmentsList.push({
              id: doc.id,
              ...appointmentData,
              doctorName: doctorData.doctorName,
              specialty: doctorData.specialty,
              schedule: doctorData.schedule,
            });
          }

          setUserAppointments(appointmentsList);

        } catch (error) {
          console.error("Error al obtener los datos del usuario", error);
        }
      } else {
        navigate("/login");
      }
      setLoading(false);
    });

    // Extraer los doctores desde Firestore
    const fetchDoctors = async () => {
      try {
        const snapshot = await db.collection("Citas").get();
        const doctorList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDoctors(doctorList);
      } catch (error) {
        console.error("Error al obtener los doctores", error);
      }
    };
    fetchDoctors();

    return () => unsubscribe();
  }, [navigate]);

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    if (!doctorName || !doctorSpecialty || !doctorHours) return;

    try {
      await db.collection("Citas").add({
        doctorName: doctorName,
        specialty: doctorSpecialty,
        schedule: doctorHours,
        available: true,
      });

      setDoctorName("");
      setDoctorSpecialty("");
      setDoctorHours("");
      alert("Doctor y horario agregado exitosamente");
    } catch (error) {
      console.error("Error al agregar doctor: ", error);
    }
  };

  const handleReserveAppointment = async (doctorId) => {
    try {
      // Verificar si la cita está disponible
      const doctorRef = db.collection("Citas").doc(doctorId);
      const doctorDoc = await doctorRef.get();

      if (doctorDoc.exists && doctorDoc.data().available) {
        // Reservar la cita
        await db.collection("CitasReservadas").add({
          doctorId,
          userId: auth.currentUser.uid,
          reservedAt: new Date(),
        });

        // Actualizar la disponibilidad de la cita
        await doctorRef.update({
          available: false,
        });

        alert("Cita reservada exitosamente");
      } else {
        alert("La cita no está disponible.");
      }
    } catch (error) {
      console.error("Error al reservar cita: ", error);
    }
  };

  const handleCancelAppointment = async (appointmentId, doctorId) => {
    try {
      // Eliminar la cita reservada de la colección CitasReservadas
      await db.collection("CitasReservadas").doc(appointmentId).delete();

      // Actualizar la disponibilidad del doctor
      await db.collection("Citas").doc(doctorId).update({
        available: true,
      });

      // Refrescar la lista de citas del usuario
      const updatedAppointmentsSnapshot = await db.collection("CitasReservadas")
        .where("userId", "==", auth.currentUser.uid)
        .get();
      const updatedAppointmentsList = updatedAppointmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserAppointments(updatedAppointmentsList);

      // Refrescar la lista de doctores
      const updatedDoctorsSnapshot = await db.collection("Citas").get();
      const updatedDoctorsList = updatedDoctorsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDoctors(updatedDoctorsList);

      alert("Cita cancelada exitosamente");
    } catch (error) {
      console.error("Error al cancelar cita: ", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Bienvenido, {user ? user.name : "Invitado"}</h2>

      {user && user.role === "admin" ? (
        <div>
          <h3>Área de Administración</h3>

          {/* Formulario para agregar doctor */}
          <div>
            <h4>Agregar Doctor y Horario</h4>
            <form onSubmit={handleAddDoctor}>
              <input
                type="text"
                placeholder="Nombre del doctor"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Especialidad"
                value={doctorSpecialty}
                onChange={(e) => setDoctorSpecialty(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Horarios del doctor"
                value={doctorHours}
                onChange={(e) => setDoctorHours(e.target.value)}
                required
              />
              <button type="submit">Agregar Doctor y Horario</button>
            </form>
          </div>

          {/* Lista de doctores */}
          <div>
            <h4>Doctores y Horarios Disponibles</h4>
            <ul>
              {doctors.map((doctor, index) => (
                <li key={index}>
                  <h5>Dr. {doctor.doctorName}</h5>
                  <p><strong>Especialidad:</strong> {doctor.specialty}</p>
                  <p><strong>Horarios:</strong> {doctor.schedule}</p>
                  <p><strong>Disponibilidad:</strong> {doctor.available ? "Disponible" : "No disponible"}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : user && user.role === "user" ? (
        <div>
          <h3>Área de Usuario</h3>

          {/* Mostrar citas reservadas del usuario */}
          {userAppointments.length > 0 ? (
            <div>
              <h4>Mis Citas Reservadas</h4>
              <ul>
                {userAppointments.map((appointment, index) => (
                  <li key={index}>
                    <h5>Dr. {appointment.doctorName}</h5>
                    <p><strong>Especialidad:</strong> {appointment.specialty}</p>
                    <p><strong>Horario:</strong> {appointment.schedule}</p>
                    <button onClick={() => handleCancelAppointment(appointment.id, appointment.doctorId)}>
                      Cancelar Cita
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No tienes citas reservadas.</p>
          )}

          {/* Mostrar doctores disponibles para que el usuario reserve */}
          <h4>Doctores y Horarios Disponibles</h4>
          <ul>
            {doctors.map((doctor, index) => (
              <li key={index}>
                <h5>Dr. {doctor.doctorName}</h5>
                <p><strong>Especialidad:</strong> {doctor.specialty}</p>
                <p><strong>Horarios:</strong> {doctor.schedule}</p>
                <button
                  onClick={() => handleReserveAppointment(doctor.id)}
                  disabled={!doctor.available}
                >
                  Reservar Cita
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No tienes permisos de administración.</p>
      )}
    </div>
  );
};

export default Admin;
