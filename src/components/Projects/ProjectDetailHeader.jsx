import { Row, Col, Card, Badge } from "react-bootstrap";
import UserBadge from "../Shared/UserBadge";

const ProjectDetailHeader = ({ project, managers, staff }) => {
  return (
    <Card>
      <Card.Header>
        <h4 className="font-title mb-0">{project.projectName}</h4>
        <span className="text-muted">Cliente: {project.clientName}</span>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={8}>
            <p>
              <strong>Descrizione:</strong> {project.projectDescription}
            </p>

            <div className="mt-3">
              <h6 className="font-title">Team di Progetto</h6>
              <div className="mb-2">
                <strong>Manager(s):</strong>
                <div className="d-flex flex-wrap align-items-center mt-1">
                  {managers?.length > 0 ? (
                    managers.map((user) => <UserBadge key={user.id} user={user} />)
                  ) : (
                    <span className="text-muted ms-1 small">Nessuno</span>
                  )}
                </div>
              </div>
              <div>
                <strong>Staff:</strong>
                <div className="d-flex flex-wrap align-items-center mt-1">
                  {staff?.length > 0 ? (
                    staff.map((user) => <UserBadge key={user.id} user={user} />)
                  ) : (
                    <span className="text-muted ms-1 small">Nessuno</span>
                  )}
                </div>
              </div>
            </div>
          </Col>

          <Col md={4} className="text-md-end">
            <p className="mb-1">
              <strong>Stato:</strong>{" "}
              <Badge bg={project.status === "LATE" ? "danger" : project.status === "ON_TIME" ? "success" : "secondary"}>
                {project.status || "DEFINING"}
              </Badge>
            </p>
            <p className="mb-1">
              <strong>Inizio:</strong> {new Date(project.startDate).toLocaleDateString()}
            </p>
            <p className="mb-1">
              <strong>Fine:</strong> {new Date(project.endDate).toLocaleDateString()}
            </p>
            <p className="mb-1">
              <strong>Effort Stimato:</strong> {project.estimatedEffort} ore
            </p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ProjectDetailHeader;
