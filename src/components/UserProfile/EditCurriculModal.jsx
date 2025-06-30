import { useState } from "react";
import { Modal, Button, Form, Row, Col, Tabs, Tab, Alert, Spinner, Card } from "react-bootstrap";
import CurriculumItemCard from "./CurriculumItemCard";
import { authorizedFetch } from "../../utils/api";

const languageLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];
const projectContexts = [
  "BANKING",
  "RETAIL",
  "ENERGY",
  "HEALTHCARE",
  "TELECOMMUNICATIONS",
  "GOVERNMENT",
  "MANUFACTURING",
  "AUTOMOTIVE",
  "FINANCE",
  "INSURANCE",
  "EDUCATION",
  "TRAVEL",
  "LOGISTICS",
  "E_COMMERCE",
  "MEDIA",
  "PHARMACEUTICAL",
  "AGRICULTURE",
  "REAL_ESTATE",
  "LEGAL",
  "NON_PROFIT",
  "AEROSPACE",
  "DEFENSE",
  "UTILITIES",
  "BIOTECHNOLOGY",
  "FOOD_BEVERAGE",
  "TEXTILE",
  "MINING",
  "CHEMICAL",
  "CONSULTING",
  "RESEARCH_DEVELOPMENT",
];

const EditCurriculumModal = ({ show, handleClose, curriculumData, onCurriculumUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [newQualification, setNewQualification] = useState({ nomeTitolo: "", istituto: "", citta: "", voto: "" });
  const [newExperience, setNewExperience] = useState({ experienceDescription: "", context: "" });
  const [newCompetency, setNewCompetency] = useState({ nome: "", livello: 1 });
  const [newCertification, setNewCertification] = useState({ nome: "" });
  const [newLanguage, setNewLanguage] = useState({ languageName: "", level: "A1" });

  const makeApiCall = async (callback) => {
    setIsLoading(true);
    setError("");
    try {
      await callback();
      if (onCurriculumUpdate) {
        onCurriculumUpdate();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleAddQualification = () =>
    makeApiCall(async () => {
      await authorizedFetch(`http://localhost:8080/api/curricula/${curriculumData.id}/qualifications`, {
        method: "POST",
        body: JSON.stringify(newQualification),
      });
      setNewQualification({ nomeTitolo: "", istituto: "", citta: "", voto: "" });
    });

  const handleRemoveQualification = (id) =>
    makeApiCall(async () => {
      await authorizedFetch(`http://localhost:8080/api/curricula/${curriculumData.id}/qualifications/${id}`, {
        method: "DELETE",
      });
    });

  const handleAddExperience = () =>
    makeApiCall(async () => {
      await authorizedFetch(`http://localhost:8080/api/curricula/${curriculumData.id}/professional-experiences`, {
        method: "POST",
        body: JSON.stringify(newExperience),
      });
      setNewExperience({ experienceDescription: "", context: "" });
    });

  const handleRemoveExperience = (id) =>
    makeApiCall(async () => {
      await authorizedFetch(`http://localhost:8080/api/curricula/${curriculumData.id}/professional-experiences/${id}`, {
        method: "DELETE",
      });
    });

  const handleAddCompetency = () =>
    makeApiCall(async () => {
      await authorizedFetch(`http://localhost:8080/api/curricula/${curriculumData.id}/competencies`, {
        method: "POST",
        body: JSON.stringify(newCompetency),
      });
      setNewCompetency({ nome: "", livello: 1 });
    });

  const handleRemoveCompetency = (id) =>
    makeApiCall(async () => {
      await authorizedFetch(`http://localhost:8080/api/curricula/${curriculumData.id}/competencies/${id}`, {
        method: "DELETE",
      });
    });

  const handleAddCertification = () =>
    makeApiCall(async () => {
      await authorizedFetch(`http://localhost:8080/api/curricula/${curriculumData.id}/certifications`, {
        method: "POST",
        body: JSON.stringify(newCertification),
      });
      setNewCertification({ nome: "" });
    });

  const handleRemoveCertification = (id) =>
    makeApiCall(async () => {
      await authorizedFetch(`http://localhost:8080/api/curricula/${curriculumData.id}/certifications/${id}`, {
        method: "DELETE",
      });
    });

  const handleAddLanguage = () =>
    makeApiCall(async () => {
      await authorizedFetch(`http://localhost:8080/api/curricula/${curriculumData.id}/languages`, {
        method: "POST",
        body: JSON.stringify(newLanguage),
      });
      setNewLanguage({ languageName: "", level: "A1" });
    });

  const handleRemoveLanguage = (id) =>
    makeApiCall(async () => {
      await authorizedFetch(`http://localhost:8080/api/curricula/${curriculumData.id}/languages/${id}`, {
        method: "DELETE",
      });
    });

  return (
    <Modal show={show} onHide={handleClose} size="xl" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="font-title">Modifica Curriculum</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" onClose={() => setError("")} dismissible>
            {error}
          </Alert>
        )}
        <Tabs defaultActiveKey="qualifications" className="mb-3" justify>
          {/* Titoli di Studio */}
          <Tab eventKey="qualifications" title="Titoli di Studio">
            <Card.Body>
              <h5 className="font-title">Titoli Aggiunti</h5>
              {curriculumData?.qualifications?.map((q) => (
                <CurriculumItemCard key={q.id} item={q} onRemove={() => handleRemoveQualification(q.id)}>
                  <strong>{q.nomeTitolo}</strong> - {q.istituto}
                </CurriculumItemCard>
              ))}
              <hr />
              <h5 className="font-title">Aggiungi Nuovo Titolo</h5>
              <Row>
                <Col md={6}>
                  <Form.Control
                    className="mb-2"
                    placeholder="Nome Titolo *"
                    value={newQualification.nomeTitolo}
                    onChange={(e) => setNewQualification({ ...newQualification, nomeTitolo: e.target.value })}
                  />
                </Col>
                <Col md={6}>
                  <Form.Control
                    className="mb-2"
                    placeholder="Istituto *"
                    value={newQualification.istituto}
                    onChange={(e) => setNewQualification({ ...newQualification, istituto: e.target.value })}
                  />
                </Col>
                <Col md={6}>
                  <Form.Control
                    className="mb-2"
                    placeholder="Città *"
                    value={newQualification.citta}
                    onChange={(e) => setNewQualification({ ...newQualification, citta: e.target.value })}
                  />
                </Col>
                <Col md={6}>
                  <Form.Control
                    className="mb-2"
                    placeholder="Voto"
                    value={newQualification.voto}
                    onChange={(e) => setNewQualification({ ...newQualification, voto: e.target.value })}
                  />
                </Col>
              </Row>
              <Button onClick={handleAddQualification} disabled={isLoading}>
                {isLoading ? <Spinner size="sm" /> : "Aggiungi Titolo"}
              </Button>
            </Card.Body>
          </Tab>

          <Tab eventKey="experiences" title="Esperienze">
            <Card.Body>
              <h5 className="font-title">Esperienze Aggiunte</h5>
              {curriculumData?.professionalExperiences?.map((exp) => (
                <CurriculumItemCard key={exp.id} item={exp} onRemove={() => handleRemoveExperience(exp.id)}>
                  <strong>{exp.context}</strong>: {exp.experienceDescription}
                </CurriculumItemCard>
              ))}
              <hr />
              <h5 className="font-title">Aggiungi Nuova Esperienza</h5>
              <Form.Control
                as="textarea"
                rows={3}
                className="mb-2"
                placeholder="Descrizione attività *"
                value={newExperience.experienceDescription}
                onChange={(e) => setNewExperience({ ...newExperience, experienceDescription: e.target.value })}
              />
              <Form.Select
                className="mb-2"
                value={newExperience.context}
                onChange={(e) => setNewExperience({ ...newExperience, context: e.target.value })}
              >
                <option value="">Seleziona contesto *</option>
                {projectContexts.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Form.Select>
              <Button onClick={handleAddExperience} disabled={isLoading}>
                {isLoading ? <Spinner size="sm" /> : "Aggiungi Esperienza"}
              </Button>
            </Card.Body>
          </Tab>

          <Tab eventKey="competencies" title="Competenze">
            <Card.Body>
              <h5 className="font-title">Competenze Aggiunte</h5>
              {curriculumData?.competencies?.map((c) => (
                <CurriculumItemCard key={c.id} item={c} onRemove={() => handleRemoveCompetency(c.id)}>
                  <strong>{c.nome}</strong> - Livello: {c.livello}/5
                </CurriculumItemCard>
              ))}
              <hr />
              <h5 className="font-title">Aggiungi Nuova Competenza</h5>
              <Row>
                <Col>
                  <Form.Control
                    className="mb-2"
                    placeholder="Nome competenza *"
                    value={newCompetency.nome}
                    onChange={(e) => setNewCompetency({ ...newCompetency, nome: e.target.value })}
                  />
                </Col>
                <Col>
                  <Form.Select
                    className="mb-2"
                    value={newCompetency.livello}
                    onChange={(e) => setNewCompetency({ ...newCompetency, livello: parseInt(e.target.value) })}
                  >
                    {[1, 2, 3, 4, 5].map((l) => (
                      <option key={l} value={l}>
                        Livello {l}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
              <Button onClick={handleAddCompetency} disabled={isLoading}>
                {isLoading ? <Spinner size="sm" /> : "Aggiungi Competenza"}
              </Button>
            </Card.Body>
          </Tab>

          <Tab eventKey="certifications" title="Certificazioni">
            <Card.Body>
              <h5 className="font-title">Certificazioni Aggiunte</h5>
              {curriculumData?.certifications?.map((c) => (
                <CurriculumItemCard key={c.id} item={c} onRemove={() => handleRemoveCertification(c.id)}>
                  {c.name}
                </CurriculumItemCard>
              ))}
              <hr />
              <h5 className="font-title">Aggiungi Nuova Certificazione</h5>
              <Form.Control
                className="mb-2"
                placeholder="Nome certificazione *"
                value={newCertification.nome}
                onChange={(e) => setNewCertification({ nome: e.target.value })}
              />
              <Button onClick={handleAddCertification} disabled={isLoading}>
                {isLoading ? <Spinner size="sm" /> : "Aggiungi Certificazione"}
              </Button>
            </Card.Body>
          </Tab>

          <Tab eventKey="languages" title="Lingue">
            <Card.Body>
              <h5 className="font-title">Lingue Aggiunte</h5>
              {curriculumData?.languages?.map((l) => (
                <CurriculumItemCard key={l.id} item={l} onRemove={() => handleRemoveLanguage(l.id)}>
                  <strong>{l.languageName}</strong> - Livello {l.level}
                </CurriculumItemCard>
              ))}
              <hr />
              <h5 className="font-title">Aggiungi Nuova Lingua</h5>
              <Row>
                <Col>
                  <Form.Control
                    className="mb-2"
                    placeholder="Lingua *"
                    value={newLanguage.languageName}
                    onChange={(e) => setNewLanguage({ ...newLanguage, languageName: e.target.value })}
                  />
                </Col>
                <Col>
                  <Form.Select
                    className="mb-2"
                    value={newLanguage.level}
                    onChange={(e) => setNewLanguage({ ...newLanguage, level: e.target.value })}
                  >
                    {languageLevels.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
              <Button onClick={handleAddLanguage} disabled={isLoading}>
                {isLoading ? <Spinner size="sm" /> : "Aggiungi Lingua"}
              </Button>
            </Card.Body>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};

export default EditCurriculumModal;
