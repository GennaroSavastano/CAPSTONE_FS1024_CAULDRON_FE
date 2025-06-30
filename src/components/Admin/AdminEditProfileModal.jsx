import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import { authorizedFetch } from "../../utils/api";
import { API_BASE_URL } from "../../config";

const funcionalFigures = [
  "SOFTWARE_DEVELOPER",
  "DATA_SCIENTIST",
  "DEVOPS_ENGINEER",
  "UI_UX_DESIGNER",
  "QA_ENGINEER",
  "BUSINESS_ANALYST",
  "IT_PROJECT_MANAGER",
  "CYBERSECURITY_SPECIALIST",
  "NETWORK_ENGINEER",
  "DATABASE_ADMINISTRATOR",
  "SYSTEM_ADMINISTRATOR",
  "TECHNICAL_WRITER",
  "ERP_CONSULTANT",
  "CRM_CONSULTANT",
  "SCRUM_MASTER",
  "PRODUCT_OWNER",
  "IT_AUDITOR",
  "IT_CONSULTANT",
  "IT_TRAINER",
  "TECHNICAL_SUPPORT_SPECIALIST",
  "SOLUTION_ARCHITECT",
  "ENTERPRISE_ARCHITECT",
  "BI_DEVELOPER",
  "MACHINE_LEARNING_ENGINEER",
  "AI_ENGINEER",
  "BLOCKCHAIN_DEVELOPER",
  "FRONTEND_DEVELOPER",
  "BACKEND_DEVELOPER",
  "FULLSTACK_DEVELOPER",
];

const AdminEditProfileModal = ({ show, handleClose, userData, onProfileUpdate }) => {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (show && userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || `${userData.username}@cauldron.com`,
        dateOfBirth: userData.dateOfBirth || "",
        country: userData.country || "",
        city: userData.city || "",
        phoneNumber: userData.phoneNumber || "",
        portfolioLink: userData.portfolioLink || "",
        funcionalFigure: userData.funcionalFigure || funcionalFigures[0],
        userId: userData.userId,
      });
    }
  }, [show, userData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    setError("");

    const isUpdating = !!userData.profileId;
    const method = isUpdating ? "PUT" : "POST";
    const url = isUpdating ? `/api/profiles/${userData.profileId}` : `/api/profiles/${userData.userId}`;

    try {
      const response = await authorizedFetch(`${API_BASE_URL}${url}`, {
        method: method,
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || `Errore durante il salvataggio del profilo.`);
      }
      alert(`Profilo ${isUpdating ? "aggiornato" : "creato"} con successo!`);
      onProfileUpdate();
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="font-title">
          {userData?.profileId ? `Modifica Profilo di ${userData.firstName}` : `Crea Profilo per ${userData.username}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control type="text" name="firstName" value={formData.firstName || ""} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Cognome</Form.Label>
                <Form.Control type="text" name="lastName" value={formData.lastName || ""} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email || ""} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Data di Nascita</Form.Label>
                <Form.Control
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Paese</Form.Label>
                <Form.Control type="text" name="country" value={formData.country || ""} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Città</Form.Label>
                <Form.Control type="text" name="city" value={formData.city || ""} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Numero di Telefono</Form.Label>
                <Form.Control
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Link al Portfolio</Form.Label>
                <Form.Control
                  type="text"
                  name="portfolioLink"
                  value={formData.portfolioLink || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Figura Funzionale</Form.Label>
            <Form.Select name="funcionalFigure" value={formData.funcionalFigure || ""} onChange={handleChange}>
              {funcionalFigures.map((ff) => (
                <option key={ff} value={ff}>
                  {ff.replaceAll("_", " ")}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Annulla
        </Button>
        <Button variant="primary" onClick={handleSaveChanges} disabled={isLoading}>
          {isLoading ? <Spinner as="span" size="sm" /> : "Salva"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AdminEditProfileModal;
