import { useState, useEffect, useCallback } from "react";
import { Accordion, Button, Spinner, Alert, Col, Row, ButtonGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { authorizedFetch } from "../../utils/api";
import { API_BASE_URL } from "../../config";
import AddProjectModal from "./AddProjectModal";
import EditProjectModal from "./EditProjectModal";
import ProjectDetailHeader from "./ProjectDetailHeader";
import ConfirmModal from "../Shared/ConfirmModal";
import TaskList from "./Tasks/TaskList";
import SalList from "./Sals/SalList";
import ConsultantTaskList from "./Tasks/ConsultantTaskList";

const ProjectAccordionItem = ({ project, user, onProjectDelete }) => {
  const [details, setDetails] = useState(null);
  const [team, setTeam] = useState({ managers: [], staff: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const canEdit = user?.roles.includes("SENIOR_MANAGER") || project.projectManagersIds.includes(user?.id);

  const forceRefreshDetails = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const projectResponse = await authorizedFetch(`${API_BASE_URL}/api/projects/${project.id}`);
      if (!projectResponse.ok) throw new Error("Errore nel caricamento dei dettagli del progetto.");
      const projectData = await projectResponse.json();
      setDetails(projectData);

      const allMemberIds = [...(projectData.projectManagersIds || []), ...(projectData.staffMembersIds || [])];
      if (allMemberIds.length > 0) {
        const profilesResponse = await authorizedFetch(`${API_BASE_URL}/api/profiles/by-ids`, {
          method: "POST",
          body: JSON.stringify(allMemberIds),
        });
        if (!profilesResponse.ok) throw new Error("Errore nel caricamento dei profili utente.");

        const memberProfiles = await profilesResponse.json();
        const managerProfiles = memberProfiles.filter((p) => projectData.projectManagersIds.includes(p.userId));
        const staffProfiles = memberProfiles.filter((p) => projectData.staffMembersIds.includes(p.userId));
        setTeam({ managers: managerProfiles, staff: staffProfiles });
      } else {
        setTeam({ managers: [], staff: [] });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [project.id]);

  const executeDelete = async () => {
    setShowConfirmDelete(false);
    try {
      await authorizedFetch(`${API_BASE_URL}/api/projects/${project.id}`, { method: "DELETE" });
      alert("Progetto eliminato con successo.");
      onProjectDelete();
    } catch (error) {
      alert(`Errore durante l'eliminazione del progetto: ${error.message}`);
    }
  };

  const assignableUsers = [...team.managers, ...team.staff];

  return (
    <>
      <Accordion.Item eventKey={project.id} className="accordion-item-custom">
        <Accordion.Header
          className="accordion-header-custom font-title"
          onClick={() => !details && forceRefreshDetails()}
        >
          {project.projectName} - (Cliente: {project.clientName})
        </Accordion.Header>
        <Accordion.Body>
          {isLoading && (
            <div className="text-center">
              <Spinner animation="border" size="sm" />
            </div>
          )}
          {error && <Alert variant="danger">{error}</Alert>}
          {details && (
            <>
              {canEdit && (
                <div className="text-end mb-3">
                  <Button variant="outline-primary" size="sm" onClick={() => setShowEditModal(true)}>
                    Modifica Progetto
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="ms-2"
                    onClick={() => setShowConfirmDelete(true)}
                  >
                    Elimina Progetto
                  </Button>
                </div>
              )}
              <ProjectDetailHeader project={details} managers={team.managers} staff={team.staff} />
              <Row className="mt-4">
                <Col md={8}>
                  <h5 className="font-title">Attività (Task)</h5>
                  {canEdit ? (
                    <TaskList
                      tasks={details.tasks || []}
                      projectId={project.id}
                      canEdit={canEdit}
                      assignableUsers={assignableUsers}
                      onProjectUpdate={forceRefreshDetails}
                    />
                  ) : (
                    <ConsultantTaskList projectId={project.id} assignableUsers={assignableUsers} />
                  )}
                </Col>
                <Col md={4}>
                  <h5 className="font-title">Stato Avanzamento Lavori (SAL)</h5>
                  <SalList
                    sals={details.sals || []}
                    projectId={project.id}
                    canEdit={canEdit}
                    onProjectUpdate={forceRefreshDetails}
                  />
                </Col>
              </Row>
            </>
          )}
        </Accordion.Body>
      </Accordion.Item>
      {details && (
        <EditProjectModal
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          projectData={details}
          onProjectUpdated={forceRefreshDetails}
        />
      )}
      <ConfirmModal
        show={showConfirmDelete}
        handleClose={() => setShowConfirmDelete(false)}
        handleConfirm={executeDelete}
        title="Conferma Eliminazione Progetto"
        body={`Sei sicuro di voler eliminare il progetto "${project.projectName}"? L'azione è irreversibile.`}
      />
    </>
  );
};

const ProjectsAccordion = () => {
  const { user } = useSelector((state) => state.auth);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState("all");

  const isSenior = user?.roles.includes("SENIOR_MANAGER");
  const isPm = user?.roles.includes("PROJECT_MANAGER");

  const fetchProjects = useCallback(async () => {
    if (!user) return;

    let endpoint = "/api/projects/assignedProjects";
    if (isSenior) {
      endpoint = viewMode === "mine" ? "/api/projects/myProjects" : "/api/projects";
    } else if (isPm) {
      endpoint = "/api/projects/myProjects";
    }

    setLoading(true);
    setError("");
    try {
      const response = await authorizedFetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) throw new Error("Errore nel caricamento dei progetti.");
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      if (err.message !== "Sessione scaduta.") setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, isSenior, isPm, viewMode]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="container mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="font-title mb-0">Progetti</h3>
        {(isSenior || isPm) && (
          <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
            + Crea Nuovo Progetto
          </Button>
        )}
      </div>

      {isSenior && (
        <ButtonGroup className="mb-3">
          <Button variant={viewMode === "all" ? "primary" : "outline-primary"} onClick={() => setViewMode("all")}>
            Tutti i Progetti
          </Button>
          <Button variant={viewMode === "mine" ? "primary" : "outline-primary"} onClick={() => setViewMode("mine")}>
            I Miei Progetti
          </Button>
        </ButtonGroup>
      )}

      {loading && (
        <div className="text-center">
          <Spinner />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Accordion>
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectAccordionItem key={project.id} project={project} user={user} onProjectDelete={fetchProjects} />
            ))
          ) : (
            <p className="text-muted text-center">Nessun progetto da visualizzare.</p>
          )}
        </Accordion>
      )}

      <AddProjectModal show={showAddModal} handleClose={() => setShowAddModal(false)} onProjectAdded={fetchProjects} />
    </div>
  );
};

export default ProjectsAccordion;
