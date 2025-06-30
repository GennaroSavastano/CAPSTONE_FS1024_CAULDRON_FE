import { useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { LOGIN_FAIL, LOGIN_SUCCESS, REGISTER_FAIL, REGISTER_SUCCESS } from "../redux/actions/authActions";

const LoginModal = ({ show, handleClose }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const loginEndpoint = "http://localhost:8080/api/auth/login";
    const registerEndpoint = "http://localhost:8080/api/auth/register";
    const body = { username, password };

    try {
      if (!isLoginView) {
        const registerResponse = await fetch(registerEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!registerResponse.ok) {
          const errData = await registerResponse.json();
          throw new Error(errData.message || "Registrazione fallita.");
        }
      }

      const loginResponse = await fetch(loginEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!loginResponse.ok) {
        const errData = await loginResponse.json();
        throw new Error(errData.message || "Credenziali non valide.");
      }

      const loginData = await loginResponse.json();
      const token = loginData.token;

      const currentUserResponse = await fetch("http://localhost:8080/api/auth/current-user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!currentUserResponse.ok) {
        throw new Error("Impossibile recuperare i dati utente dopo il login.");
      }

      const fullUser = await currentUserResponse.json();

      localStorage.setItem("token", token);

      const actionType = isLoginView ? LOGIN_SUCCESS : REGISTER_SUCCESS;
      dispatch({
        type: actionType,
        payload: { token: token, user: fullUser },
      });

      handleClose();
    } catch (err) {
      setError(err.message);
      const actionType = isLoginView ? LOGIN_FAIL : REGISTER_FAIL;
      dispatch({ type: actionType, payload: { error: err.message } });
    } finally {
      setIsLoading(false);
    }
  };

  const switchView = () => {
    setIsLoginView(!isLoginView);
    setError("");
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="font-title">{isLoginView ? "Login" : "Registrati"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleFormSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Inserisci il tuo username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Inserisci la tua password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
            {isLoading ? <Spinner as="span" animation="border" size="sm" /> : isLoginView ? "Accedi" : "Registrati"}
          </Button>
        </Form>
        <div className="text-center mt-3">
          <Button variant="link" onClick={switchView}>
            {isLoginView ? "Non hai un account? Registrati" : "Hai già un account? Accedi"}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
