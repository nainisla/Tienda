import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
// 🚨 Nota: Reemplazamos 'Link' con 'a' para simplificar las dependencias internas del modal.
// import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

// El componente recibe dos props:
// 1. show: Un booleano que indica si se debe mostrar el modal.
// 2. handleClose: Una función para cerrar el modal (actualiza el estado en App.jsx).
const LoginModal = ({ show, handleClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ===============================================
  // 1. LÓGICA DE LOGIN TRADICIONAL (EMAIL/CONTRASEÑA)
  // ===============================================
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (email === "" || password === "") {
      setError("Por favor, completa ambos campos.");
      return;
    }

    console.log("Intentando login tradicional con:", { email, password });

    // 🚨 Llamada a la API Flask para Login tradicional
    axios
      .post("http://127.0.0.1:5000/auth/login", { email, password })
      .then((res) => {
        // Manejo exitoso: almacenar token, actualizar estado de autenticación.
        console.log("Login exitoso:", res.data);
        // localStorage.setItem('userToken', res.data.access_token);
        handleClose(); // Cerrar el modal al iniciar sesión
      })
      .catch((err) => {
        // Manejo de error: credenciales incorrectas o error de servidor.
        console.error("Error en login tradicional:", err);
        setError(
          "Credenciales incorrectas o error de servidor. Intenta de nuevo."
        );
      });
  };

  // ===============================================
  // 2. LÓGICA DE LOGIN CON GOOGLE
  // ===============================================

  // Función que se ejecuta cuando Google envía la credencial JWT exitosamente
  const handleGoogleSuccess = (response) => {
    console.log(
      "Login con Google exitoso. Enviando credencial a Flask...",
      response
    );
    const googleToken = response.credential;

    // 🚨 Llamada a la API Flask para verificar y autenticar con token de Google
    axios
      .post("http://127.0.0.1:5000/auth/google", {
        token: googleToken,
      })
      .then((res) => {
        // Manejo exitoso: almacenar token de la app, actualizar estado.
        console.log("Respuesta del Backend de Flask:", res.data);
        // localStorage.setItem('userToken', res.data.access_token);
        handleClose(); // Cerrar el modal al iniciar sesión
      })
      .catch((err) => {
        console.error("Error al enviar el token a Flask:", err);
        setError(
          "Error al procesar la autenticación de Google en el servidor."
        );
      });
  };

  // Función que se ejecuta si falla el inicio de sesión con Google
  const handleGoogleFailure = (error) => {
    console.error("Login con Google fallido:", error);
    setError("El inicio de sesión con Google falló. Inténtalo de nuevo.");
  };

  // ===============================================
  // 3. RENDERIZADO DEL MODAL
  // ===============================================

  return (
    // Usamos el componente Modal de React-Bootstrap
    <Modal show={show} onHide={handleClose} centered>
      {/* Cabecera, similar a "adiclub INICIÁ SESIÓN" */}
      <Modal.Header closeButton className="d-block text-center border-0 pb-0">
        <Modal.Title as="h2" className="fw-bold">
          INICIÁ SESIÓN O REGISTRATE
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-2 px-4">
        <p className="text-center text-muted">
          Disfrutá de acceso exclusivo a productos, experiencias, ofertas y más.
        </p>

        {/* Botones de Login Social (Apple, Facebook, Google) */}
        <div className="d-flex justify-content-center mb-4">
          <Button variant="outline-dark" className="me-2">
            
          </Button>
          <Button variant="outline-primary" className="me-2">
            f
          </Button>

          {/* 🚨 COMPONENTE REAL DE GOOGLE LOGIN 🚨 */}
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            theme="outline"
            size="large"
          />
        </div>

        {/* Separador visual */}
        <div className="d-flex align-items-center mb-4">
          <div
            style={{ flexGrow: 1, height: "1px", backgroundColor: "#ccc" }}
          ></div>
          <span className="mx-2 text-muted small">O</span>
          <div
            style={{ flexGrow: 1, height: "1px", backgroundColor: "#ccc" }}
          ></div>
        </div>

        <Form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Campo de Correo Electrónico */}
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="CORREO ELECTRÓNICO *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          {/* Campo de Contraseña */}
          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="CONTRASEÑA *"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          {/* Checkbox de Suscripción (Opcional) */}
          <Form.Group className="mb-4">
            <Form.Check
              type="checkbox"
              label="Me gustaría recibir las últimas ofertas y noticias..."
              id="newsletterCheck"
            />
          </Form.Group>

          {/* Botón de Continuar */}
          <Button type="submit" variant="dark" className="w-100 py-2 fw-bold">
            CONTINUAR →
          </Button>
        </Form>

        {/* Enlace para recordar contraseña o registrarse */}
        <div className="text-center mt-3">
          {/* Usamos 'a' en lugar de 'Link' */}
          <a
            href="#"
            onClick={handleClose}
            className="d-block mb-2 text-decoration-none"
          >
            ¿Olvidaste tu contraseña?
          </a>
          <a href="#" onClick={handleClose} className="text-decoration-none">
            ¿No tienes cuenta? Regístrate
          </a>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
