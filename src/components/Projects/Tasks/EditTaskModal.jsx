import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import { authorizedFetch } from "../../../utils/api";
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

const EditTaskModal = ({ show, handleClose, taskData, projectId, assignableUsers, onTaskUpdated }) => {
  const [formData, setFormData] = useState({});
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (taskData) {
      setFormData({
        title: taskData.taskTitle || "",
        projectPhase: taskData.projectPhase || projectPhases[0],
        activityType: taskData.activityType || activityTypes[0],
        activityDescription: taskData.activityDescription || "",
        estimatedEffort: taskData.estimatedEffort || 0,
        startDate: taskData.startDate || "",
        endDate: taskData.endDate || "",
        status: taskData.status || taskStatuses[0],
        assignedUsers: taskData.assignedUsersIds || [],
      });
    }
  }, [taskData]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleUsersConfirm = (selectedIds) => setFormData({ ...formData, assignedUsers: selectedIds });

  const handleSaveChanges = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await authorizedFetch(`http://localhost:8080/api/projects/${projectId}/tasks/${taskData.id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Errore durante l'aggiornamento del task.");
      }
      alert("Task aggiornato con successo!");
      onTaskUpdated();
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Sei sicuro di voler eliminare questo task: "${taskData.taskTitle}"?`)) {
      setIsLoading(true);
      setError("");
      try {
        await authorizedFetch(`http://localhost:8080/api/projects/${projectId}/tasks/${taskData.id}`, {
          method: "DELETE",
        });
        alert("Task eliminato con successo.");
        onTaskUpdated();
        handleClose();
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getAssignedUserProfiles = () => {
    if (!assignableUsers || !formData.assignedUsers) return [];
    return assignableUsers.filter((user) => formData.assignedUsers.includes(user.userId));
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title className="font-title">Dettaglio / Modifica Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Titolo Task</Form.Label>
              <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrizione Attività</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="activityDescription"
                value={formData.activityDescription}
                onChange={handleChange}
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
                  <Form.Control type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Data Fine</Form.Label>
                  <Form.Control type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
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
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stato</Form.Label>
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
              <Form.Label>Staff Assegnato</Form.Label>
              <div className="d-flex flex-wrap align-items-center mb-2">
                {getAssignedUserProfiles().length > 0 ? (
                  getAssignedUserProfiles().map((user) => <UserBadge user={user} key={user.userId} />)
                ) : (
                  <p className="text-muted fst-italic small m-0">Nessun utente assegnato.</p>
                )}
              </div>
              <Button variant="outline-secondary" size="sm" onClick={() => setShowUserSelector(true)}>
                Modifica Assegnazioni
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="danger" onClick={handleDelete} disabled={isLoading}>
            Elimina Task
          </Button>
          <div>
            <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
              Annulla
            </Button>
            <Button variant="primary" onClick={handleSaveChanges} disabled={isLoading} className="ms-2">
              {isLoading ? <Spinner size="sm" /> : "Salva Modifiche"}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      <SelectUserModal
        show={showUserSelector}
        handleClose={() => setShowUserSelector(false)}
        usersToShow={assignableUsers}
        initialSelectedIds={formData.assignedUsers}
        onConfirmSelection={handleUsersConfirm}
      />
    </>
  );
};

export default EditTaskModal;
