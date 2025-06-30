import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Image, Card, InputGroup, Alert, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import SkillCard from "./SkillCard";
import { LOGOUT } from "../../redux/actions/authActions";
import { authorizedFetch } from "../../utils/api";

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
const skillTypes = [
  "DEVELOPMENT",
  "PROJECT_MANAGEMENT",
  "DESIGN",
  "TESTING",
  "NETWORKING",
  "DATABASE_MANAGEMENT",
  "CLOUD_COMPUTING",
  "CYBERSECURITY",
  "DATA_ANALYSIS",
  "MACHINE_LEARNING",
  "ARTIFICIAL_INTELLIGENCE",
  "BUSINESS_ANALYSIS",
  "QUALITY_ASSURANCE",
  "TECHNICAL_WRITING",
  "ERP_SYSTEMS",
  "CRM_SYSTEMS",
  "AGILE_METHODOLOGIES",
  "SCRUM",
  "DEVOPS",
  "UI_UX_DESIGN",
  "SYSTEM_ADMINISTRATION",
  "MOBILE_DEVELOPMENT",
  "WEB_DEVELOPMENT",
  "API_DESIGN",
  "BIG_DATA",
  "BLOCKCHAIN",
  "IOT",
  "ROBOTICS",
  "VIRTUAL_REALITY",
  "AUGMENTED_REALITY",
  "GAME_DEVELOPMENT",
  "TECHNICAL_SUPPORT",
  "TRAINING_DOCUMENTATION",
  "IT_CONSULTING",
  "IT_AUDIT",
  "RISK_MANAGEMENT",
  "COMPLIANCE",
  "SALES_MARKETING_IT",
  "CUSTOMER_SERVICE_IT",
  "CHANGE_MANAGEMENT_IT",
  "PROCESS_IMPROVEMENT_IT",
  "VENDOR_MANAGEMENT_IT",
];

const EditProfileModal = ({ show, handleClose, profileData, onProfileUpdate }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ type: "", level: 1 });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (show) {
      const initialFormData = {
        firstName: profileData?.firstName || "",
        lastName: profileData?.lastName || "",
        dateOfBirth: profileData?.dateOfBirth || "",
        country: profileData?.country || "",
        city: profileData?.city || "",
        phoneNumber: profileData?.phoneNumber || "",
        email: profileData?.email || user?.username || "",
        portfolioLink: profileData?.portfolioLink || "",
        funcionalFigure: profileData?.funcionalFigure || "",
      };
      setFormData(initialFormData);
      setSkills(profileData?.skills || []);
      setAvatarPreview(profileData?.avatarUrl || "https://dummyimage.com/200x200/cdc1ff/7371FC.png&text=Avatar");
      setError("");
      setAvatarFile(null);
    }
  }, [profileData, user, show]);

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    setError("");

    const isUpdating = !!profileData?.id;
    const url = isUpdating
      ? `http://localhost:8080/api/profiles/${profileData.id}`
      : `http://localhost:8080/api/profiles/${user.id}`;
    const method = isUpdating ? "PUT" : "POST";

    try {
      const profileResponse = await authorizedFetch(url, {
        method: method,
        body: JSON.stringify(formData),
      });

      if (!profileResponse.ok) {
        const errData = await profileResponse.json();
        throw new Error(errData.message || "Errore nel salvataggio del profilo.");
      }
      const savedProfile = await profileResponse.json();

      if (avatarFile) {
        const uploadData = new FormData();
        uploadData.append("avatar", avatarFile);
        const avatarResponse = await authorizedFetch(`http://localhost:8080/api/profiles/${savedProfile.id}/avatar`, {
          method: "PATCH",
          body: uploadData,
        });
        if (!avatarResponse.ok) {
          throw new Error("Profilo salvato, ma errore nel caricamento dell'avatar.");
        }
      }

      alert("Profilo salvato con successo!");
      onProfileUpdate();
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!profileData?.id) return;
    if (window.confirm("Sei sicuro di voler eliminare il tuo profilo? L'azione è irreversibile.")) {
      setIsLoading(true);
      setError("");
      try {
        await authorizedFetch(`http://localhost:8080/api/profiles/${profileData.id}`, {
          method: "DELETE",
        });
        alert("Profilo eliminato. Verrai disconnesso.");
        dispatch({ type: LOGOUT });
        navigate("/");
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.type || !profileData?.id) return;
    setIsLoading(true);
    try {
      const response = await authorizedFetch(`http://localhost:8080/api/profiles/${profileData.id}/skills`, {
        method: "POST",
        body: JSON.stringify(newSkill),
      });
      if (!response.ok) throw new Error("Errore nell'aggiunta della skill.");
      const updatedProfile = await response.json();
      setSkills(updatedProfile.skills);
      setNewSkill({ type: "", level: 1 });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSkill = async (skillId) => {
    if (!profileData?.id) return;
    setIsLoading(true);
    try {
      await authorizedFetch(`http://localhost:8080/api/profiles/${profileData.id}/skills/${skillId}`, {
        method: "DELETE",
      });
      setSkills((prev) => prev.filter((s) => s.id !== skillId));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="font-title">{profileData?.id ? "Modifica Profilo" : "Crea Profilo"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" onClose={() => setError("")} dismissible>
            {error}
          </Alert>
        )}
        <Form>
          <Row>
            <Col md={4} className="text-center mb-3">
              <Image src={avatarPreview} roundedCircle className="profile-avatar mb-2" />
              <Form.Group>
                <Form.Label>Cambia Avatar</Form.Label>
                <Form.Control type="file" size="sm" onChange={handleAvatarFileChange} accept="image/*" />
              </Form.Group>
            </Col>
            <Col md={8}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cognome</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Data di Nascita</Form.Label>
                    <Form.Control
                      required
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Figura Funzionale</Form.Label>
                    <Form.Select
                      required
                      name="funcionalFigure"
                      value={formData.funcionalFigure}
                      onChange={handleChange}
                    >
                      <option value="">Seleziona...</option>
                      {funcionalFigures.map((f) => (
                        <option key={f} value={f}>
                          {f.replaceAll("_", " ")}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control required type="email" name="email" value={formData.email} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Telefono</Form.Label>
                <Form.Control type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nazione</Form.Label>
                <Form.Control required type="text" name="country" value={formData.country} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Città</Form.Label>
                <Form.Control required type="text" name="city" value={formData.city} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Link Portfolio</Form.Label>
                <Form.Control type="url" name="portfolioLink" value={formData.portfolioLink} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>

          {profileData?.id && (
            <>
              <hr />
              <h5 className="font-title">Gestione Skill</h5>
              <Card className="p-2 mb-3 bg-light">
                <Card.Body>
                  {skills.length > 0 ? (
                    skills.map((skill) => <SkillCard key={skill.id} skill={skill} onRemove={handleRemoveSkill} />)
                  ) : (
                    <p className="text-muted text-center mb-0">Nessuna skill aggiunta.</p>
                  )}
                </Card.Body>
              </Card>
              <InputGroup>
                <Form.Select value={newSkill.type} onChange={(e) => setNewSkill({ ...newSkill, type: e.target.value })}>
                  <option value="">Seleziona tipo...</option>
                  {skillTypes.map((t) => (
                    <option key={t} value={t}>
                      {t.replaceAll("_", " ")}
                    </option>
                  ))}
                </Form.Select>
                <Form.Select
                  style={{ maxWidth: "100px" }}
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
                >
                  {[1, 2, 3, 4, 5].map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </Form.Select>
                <Button variant="outline-primary" onClick={handleAddSkill}>
                  Aggiungi
                </Button>
              </InputGroup>
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <div>
          {profileData?.id && (
            <Button variant="outline-danger" onClick={handleDeleteProfile} disabled={isLoading}>
              Cancella Profilo
            </Button>
          )}
        </div>
        <div className="ms-auto">
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            Annulla
          </Button>
          <Button variant="primary" onClick={handleSaveChanges} disabled={isLoading} className="ms-2">
            {isLoading ? <Spinner as="span" animation="border" size="sm" /> : "Salva"}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProfileModal;
