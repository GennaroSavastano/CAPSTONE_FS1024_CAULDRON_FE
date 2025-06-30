import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Spinner, Alert, Button } from "react-bootstrap";
import { authorizedFetch } from "../../utils/api";
import ProjectDetailHeader from "./ProjectDetailHeader";
import SalList from "./Sals/SalList";
import TaskList from "./Tasks/TaskList";

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true);
      try {
        const response = await authorizedFetch(`http://localhost:8080/api/projects/${projectId}`);
        if (!response.ok) {
          throw new Error("Errore nel caricamento dei dettagli del progetto.");
        }
        const data = await response.json();
        setProject(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!project) {
    return <Container className="text-center mt-5">Progetto non trovato.</Container>;
  }

  return (
    <Container className="my-4">
      <Link to="/project-manager">
        <Button variant="outline-secondary" size="sm" className="mb-3">
          &larr; Torna alla Dashboard
        </Button>
      </Link>

      {/* Componente per l'intestazione con i dettagli principali */}
      <ProjectDetailHeader project={project} />

      <Row className="mt-4">
        <Col md={8}>
          {/* Componente per la lista dei Task */}
          <h4 className="font-title">Attività (Task)</h4>
          <TaskList tasks={project.tasks || []} />
        </Col>
        <Col md={4}>
          {/* Componente per la lista dei SAL */}
          <h4 className="font-title">Stato Avanzamento Lavori (SAL)</h4>
          <SalList sals={project.sals || []} />
        </Col>
      </Row>
    </Container>
  );
};

export default ProjectDetailPage;
