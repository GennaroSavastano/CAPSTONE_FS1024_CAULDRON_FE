import { useState } from "react";
import { Accordion, Form, Button, Spinner, Alert, Row, Col } from "react-bootstrap";
import { authorizedFetch } from "../../utils/api";
import { API_BASE_URL } from "../../config";

const allRoles = ["CONSULTANT", "PROJECT_MANAGER", "SENIOR_MANAGER"];
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

const CreateEmployeeAccordion = ({ onUserCreated }) => {
  const getInitialState = () => ({
    username: "",
    password: "",
    roles: [allRoles[0]],
    firstName: "",
    lastName: "",
    email: "",
    funcionalFigure: funcionalFigures[0],
    dateOfBirth: "",
    country: "",
    city: "",
    phoneNumber: "",
    portfolioLink: "",
  });

  const [formData, setFormData] = useState(getInitialState());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === "username") {
        newState.email = value ? `${value.toLowerCase().trim()}@cauldron.com` : "";
      }
      return newState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await authorizedFetch(`${API_BASE_URL}/api/admin/users/create`, {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        if (response.status === 409) throw new Error(`L'username '${formData.username}' esiste già.`);
        const errData = await response.json();
        throw new Error(errData.message || "Errore durante la creazione.");
      }
      setSuccess("Dipendente creato con successo!");
      setFormData(getInitialState());
      if (onUserCreated) onUserCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.username.length >= 3 &&
    formData.password.length >= 6 &&
    formData.firstName &&
    formData.lastName &&
    formData.email;

  return (
    <Accordion className="mt-4 accordion_width">
      <Accordion.Item eventKey="0">
        <Accordion.Header className="accordion-header-custom">
          <span className="font-title">Crea Nuovo Dipendente</span>
        </Accordion.Header>
        <Accordion.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError("")} dismissible>
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" onClose={() => setSuccess("")} dismissible>
              {success}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <h5 className="text-muted">Credenziali di Accesso</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    minLength={3}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Ruolo</Form.Label>
              <Form.Select
                name="roles"
                value={formData.roles[0]}
                onChange={(e) => setFormData((prev) => ({ ...prev, roles: [e.target.value] }))}
              >
                {allRoles.map((r) => (
                  <option key={r} value={r}>
                    {r.replaceAll("_", " ")}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <hr />
            <h5 className="text-muted">Dati Anagrafici</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cognome</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Data di Nascita</Form.Label>
                  <Form.Control type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Paese</Form.Label>
                  <Form.Control type="text" name="country" value={formData.country} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Città</Form.Label>
                  <Form.Control type="text" name="city" value={formData.city} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Numero di Telefono</Form.Label>
                  <Form.Control type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Link al Portfolio</Form.Label>
                  <Form.Control
                    type="text"
                    name="portfolioLink"
                    value={formData.portfolioLink}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Figura Funzionale</Form.Label>
              <Form.Select name="funcionalFigure" value={formData.funcionalFigure} onChange={handleChange}>
                {funcionalFigures.map((ff) => (
                  <option key={ff} value={ff}>
                    {ff.replaceAll("_", " ")}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <div className="text-end">
              <Button type="submit" variant="primary" disabled={isLoading || !isFormValid}>
                {isLoading ? <Spinner size="sm" /> : "Crea Dipendente"}
              </Button>
            </div>
          </Form>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default CreateEmployeeAccordion;
