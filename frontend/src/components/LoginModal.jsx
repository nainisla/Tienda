import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import FacebookLogin from "./FacebookLogin.jsx"; 
import { useAuth } from "../context/AuthContext.jsx";

const API_BASE_URL = "https://localhost:5000";

const LoginModal = ({ show, handleClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { handleLoginSuccess: updateAuthContext } = useAuth();

  // ----------------------------------------------------------------------
  // 🟢 FUNCIÓN DE ÉXITO UNIFICADA para Google, Facebook y Login Tradicional
  // ----------------------------------------------------------------------
  const handleLoginSuccess = ({ access_token, role }) => {
    // 🚨 Llamar a la función del contexto (con el alias)
    updateAuthContext({ access_token, role }); // <-- ESTE ES EL LLAMADO CORREGIDO
    handleClose();
    console.log("Login exitoso. Token y rol guardados.");
  }
  // ===============================================
  // 1. LÓGICA DE LOGIN TRADICIONAL (EMAIL/CONTRASEÑA)
  // ===============================================
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    // ...
    axios
      .post(`${API_BASE_URL}/auth/login`, {
        email: email,
        password: password,
      })
      .then((res) => {
        const { session_token, user_role } = res.data;
        // 🟢 Llamar a la función unificada
        handleLoginSuccess({ access_token: session_token, role: user_role }); 
      })
      .catch((err) => {
        // ...
      });
  };

  // ===============================================
  // 2. LÓGICA DE LOGIN CON GOOGLE
  // ===============================================
  const handleGoogleSuccess = (response) => {
    console.log(
      "Login con Google exitoso. Enviando credencial a Flask...",
      response
    );
    const googleToken = response.credential;

    axios
      .post(`${API_BASE_URL}/auth/google`, {
        token: googleToken,
      })
      .then((res) => {
        // 🟢 Usamos la función unificada para manejar el éxito
        handleLoginSuccess(res.data);
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
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="d-block text-center border-0 pb-0">
        <Modal.Title as="h2" className="fw-bold">
          INICIÁ SESIÓN O REGISTRATE
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-2 px-4">
        <p className="text-center text-muted">
          Disfrutá de acceso exclusivo a productos, experiencias, ofertas y más.
        </p>
        
        {/* 🚨 ZONA DE BOTONES SOCIALES CORREGIDA 🚨 */}
        <div className="d-flex justify-content-center mb-4 align-items-center">
            
            {/* 1. FACEBOOK LOGIN */}
            {/* ✅ CRÍTICO: Usamos flex-fill para ancho 50% y justify-content-center para centrar el botón */}
            <div className="flex-fill me-2 d-flex justify-content-center" style={{ position: 'relative', top: '0.5px' }}> 
                <FacebookLogin 
                    onLoginSuccess={handleLoginSuccess}
                />
            </div>

            {/* 2. GOOGLE LOGIN */}
            {/* ✅ CRÍTICO: Usamos flex-fill para ancho 50% y justify-content-center para centrar el botón */}
            <div className="flex-fill ms-2 d-flex justify-content-center">
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleFailure}
                    theme="outline"
                    size="large" // Esto le da una altura compatible
                />
            </div>
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
