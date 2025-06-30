import { useState, useEffect, useCallback } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import SelectUserModal from "../Shared/SelectUserModal";
import UserBadge from "../Shared/UserBadge";
import { authorizedFetch } from "../../utils/api";
import { API_BASE_URL } from "../../config";
import { useSelector } from "react-redux";

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

const AddProjectModal = ({ show, handleClose, onProjectAdded }) => {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    projectName: "",
    clientName: "",
    context: projectContexts[0],
    projectDescription: "",
    startDate: "",
    endDate: "",
    estimatedEffort: 0,
  });
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedManagerIds, setSelectedManagerIds] = useState([]);
  const [selectedStaffIds, setSelectedStaffIds] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [isSelectingManagers, setIsSelectingManagers] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isSenior = user?.roles.includes("SENIOR_MANAGER");
  const isPm = user?.roles.includes("PROJECT_MANAGER");

  const resetAndFetch = useCallback(() => {
    if (show) {
      if (isPm && !isSenior) {
        setSelectedManagerIds([user.id]);
      } else {
        setSelectedManagerIds([]);
      }
      setSelectedStaffIds([]);

      const fetchUsers = async () => {
        setLoadingUsers(true);
        setError("");
        try {
          const response = await authorizedFetch(`${API_BASE_URL}/api/admin/users/details`);
          if (!response.ok) throw new Error("Errore nel caricamento dei profili utente.");
          setAllUsers(await response.json());
        } catch (err) {
          setError(err.message);
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [show, user, isPm, isSenior]);

  useEffect(() => {
    if (show) {
      resetAndFetch();
    }
  }, [show, resetAndFetch]);

  const resetStateAndClose = () => {
    setFormData({
      projectName: "",
      clientName: "",
      context: projectContexts[0],
      projectDescription: "",
      startDate: "",
      endDate: "",
      estimatedEffort: 0,
    });
    setError("");
    handleClose();
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSaveProject = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const body = { ...formData, projectManagers: selectedManagerIds, staffMembers: selectedStaffIds };
      const response = await authorizedFetch(`${API_BASE_URL}/api/projects`, {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Errore nella creazione del progetto.");
      }
      onProjectAdded();
      resetStateAndClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmManagers = (ids) => {
    const newSet = new Set(ids);
    if (isPm && !isSenior) {
      newSet.add(user.id);
    }
    setSelectedManagerIds(Array.from(newSet));
  };

  const managersToShow = allUsers.filter(
    (p) =>
      (p.roles.includes("PROJECT_MANAGER") || p.roles.includes("SENIOR_MANAGER")) &&
      !selectedStaffIds.includes(p.userId)
  );
  const consultantsToShow = allUsers.filter(
    (p) => p.roles.includes("CONSULTANT") && !selectedManagerIds.includes(p.userId)
  );

  const getSelectedProfiles = (ids) => {
    if (!ids || ids.length === 0 || allUsers.length === 0) return [];
    return allUsers.filter((u) => ids.includes(u.userId));
  };

  const selectedManagerProfiles = getSelectedProfiles(selectedManagerIds);
  const selectedStaffProfiles = getSelectedProfiles(selectedStaffIds);

  const isFormValid =
    formData.projectName &&
    formData.clientName &&
    formData.projectDescription &&
    formData.startDate &&
    formData.endDate;

  return (
    <>
      <Modal show={show} onHide={resetStateAndClose} size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title className="font-title">Crea Nuovo Progetto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form id="add-project-form" onSubmit={handleSaveProject}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome Progetto</Form.Label>
                  <Form.Control
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome Cliente</Form.Label>
                  <Form.Control
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Descrizione Progetto</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contesto</Form.Label>
                  <Form.Select name="context" value={formData.context} onChange={handleChange}>
                    {projectContexts.map((c) => (
                      <option key={c} value={c}>
                        {c.replaceAll("_", " ")}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
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
            <hr />
            <Form.Group className="mb-3">
              <Form.Label>Project Manager Assegnati</Form.Label>
              <div className="d-flex flex-wrap align-items-center mb-2" style={{ gap: "8px" }}>
                {selectedManagerProfiles.length > 0 ? (
                  selectedManagerProfiles.map((u) => <UserBadge user={u} key={u.userId} />)
                ) : (
                  <p className="text-muted fst-italic small m-0">Nessun manager assegnato.</p>
                )}
              </div>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => {
                  setIsSelectingManagers(true);
                  setShowUserModal(true);
                }}
                disabled={loadingUsers}
              >
                {loadingUsers ? "Carico..." : "Seleziona / Modifica Manager"}
              </Button>
            </Form.Group>
            <Form.Group>
              <Form.Label>Staff Assegnato</Form.Label>
              <div className="d-flex flex-wrap align-items-center mb-2" style={{ gap: "8px" }}>
                {selectedStaffProfiles.length > 0 ? (
                  selectedStaffProfiles.map((u) => <UserBadge user={u} key={u.userId} />)
                ) : (
                  <p className="text-muted fst-italic small m-0">Nessuno staff assegnato.</p>
                )}
              </div>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => {
                  setIsSelectingManagers(false);
                  setShowUserModal(true);
                }}
                disabled={loadingUsers}
              >
                {loadingUsers ? "Carico..." : "Seleziona / Modifica Staff"}
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={resetStateAndClose}>
            Annulla
          </Button>
          <Button variant="primary" type="submit" form="add-project-form" disabled={isLoading || !isFormValid}>
            {isLoading ? <Spinner size="sm" /> : "Salva Progetto"}
          </Button>
        </Modal.Footer>
      </Modal>

      <SelectUserModal
        show={showUserModal}
        handleClose={() => setShowUserModal(false)}
        usersToShow={isSelectingManagers ? managersToShow : consultantsToShow}
        initialSelectedIds={isSelectingManagers ? selectedManagerIds : selectedStaffIds}
        onConfirmSelection={isSelectingManagers ? handleConfirmManagers : setSelectedStaffIds}
      />
    </>
  );
};

export default AddProjectModal;
