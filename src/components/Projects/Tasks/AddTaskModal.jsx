import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import { authorizedFetch } from "../../../utils/api";
import { API_BASE_URL } from "../../../config";
import SelectUserModal from "../../Shared/SelectUserModal";
import UserBadge from "../../Shared/UserBadge";

const projectPhases = [
  "INIZIO_PIANIFICAZIONE",
  "ANALISI_RACCOLTA_REQUISITI",
  "DESIGN_SOLUZIONE",
  "IMPLEMENTAZIONE_SVILUPPO",
  "TEST_VALIDAZIONE",
  "RILASCIO_GO_LIVE",
  "SUPPORTO_MONITORAGGIO_POST_LIVE",
  "CHIUSURA_PROGETTO",
];
const activityTypes = [
  "KICK_OFF_ONBOARDING",
  "RACCOLTA_REQUISITI",
  "ANALISI_TECNICA_FUNZIONALE",
  "PROGETTAZIONE_SOLUZIONE",
  "SETUP_AMBIENTI",
  "SVILUPPO_CONFIGURAZIONE",
  "INTEGRAZIONE_SISTEMI_TERZI",
  "TESTING_TECNICO",
  "TESTING_UTENTE_UAT",
  "FORMAZIONE_DOCUMENTAZIONE",
  "GO_LIVE",
  "MONITORAGGIO_POST_GO_LIVE",
  "ANALISI_FINALE_LESSON_LEARNED",
  "CHIUSURA_PROGETTO",
];
const taskStatuses = ["TO_DO", "IN_PROGRESS", "DONE"];

const AddTaskModal = ({ show, handleClose, projectId, availableStaff = [], onTaskAdded }) => {
  const getInitialFormData = () => ({
    title: "",
    projectPhase: projectPhases[0],
    activityType: activityTypes[0],
    activityDescription: "",
    estimatedEffort: 0,
    startDate: "",
    endDate: "",
    status: taskStatuses[0],
    assignedUsers: [],
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (show) {
      setFormData(getInitialFormData());
      setError("");
    }
  }, [show]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleUsersConfirm = (selectedIds) => setFormData({ ...formData, assignedUsers: selectedIds });

  const handleAddTask = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await authorizedFetch(`${API_BASE_URL}/api/projects/${projectId}/tasks`, {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Errore durante la creazione del task.");
      }
      alert("Task creato con successo!");
      onTaskAdded();
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getAssignedUserProfiles = () => {
    return availableStaff.filter((user) => formData.assignedUsers.includes(user.userId));
  };

  const isFormValid = formData.title && formData.activityDescription && formData.startDate && formData.endDate;

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title className="font-title">Aggiungi Nuovo Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form id="add-task-form" onSubmit={handleAddTask}>
            <Form.Group className="mb-3">
              <Form.Label>Titolo Task</Form.Label>
              <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrizione Attività</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="activityDescription"
                value={formData.activityDescription}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fase del Progetto</Form.Label>
                  <Form.Select name="projectPhase" value={formData.projectPhase} onChange={handleChange}>
                    {projectPhases.map((p) => (
                      <option key={p} value={p}>
                        {p.replaceAll("_", " ")}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo di Attività</Form.Label>
                  <Form.Select name="activityType" value={formData.activityType} onChange={handleChange}>
                    {activityTypes.map((a) => (
                      <option key={a} value={a}>
                        {a.replaceAll("_", " ")}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Data Inizio</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Data Fine</Form.Label>
                  <Form.Control type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Effort Stimato (ore)</Form.Label>
                  <Form.Control
                    type="number"
                    name="estimatedEffort"
                    value={formData.estimatedEffort}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stato Iniziale</Form.Label>
                  <Form.Select name="status" value={formData.status} onChange={handleChange}>
                    {taskStatuses.map((s) => (
                      <option key={s} value={s}>
                        {s.replaceAll("_", " ")}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <hr />
            <Form.Group className="mb-3">
              <Form.Label>Assegna a Staff</Form.Label>
              <div className="d-flex flex-wrap align-items-center mb-2" style={{ gap: "8px" }}>
                {getAssignedUserProfiles().map((user) => (
                  <UserBadge user={user} key={user.userId} />
                ))}
              </div>
              <Button variant="outline-secondary" size="sm" onClick={() => setShowUserSelector(true)}>
                Seleziona Utenti
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annulla
          </Button>
          <Button variant="primary" type="submit" form="add-task-form" disabled={isLoading || !isFormValid}>
            {isLoading ? <Spinner size="sm" /> : "Salva Task"}
          </Button>
        </Modal.Footer>
      </Modal>

      <SelectUserModal
        show={showUserSelector}
        handleClose={() => setShowUserSelector(false)}
        usersToShow={availableStaff}
        initialSelectedIds={formData.assignedUsers}
        onConfirmSelection={handleUsersConfirm}
      />
    </>
  );
};

export default AddTaskModal;
