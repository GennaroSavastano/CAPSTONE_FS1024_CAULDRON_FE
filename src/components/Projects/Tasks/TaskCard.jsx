import { Card, Badge, Row, Col } from "react-bootstrap";
import UserBadge from "../../Shared/UserBadge";

const TaskCard = ({ task, onClick, assignedProfiles = [] }) => {
  const formatEnum = (text) => {
    if (!text) return "";
    return text
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div onClick={onClick} style={{ cursor: "pointer" }} className="mb-2 task-card">
      <Card>
        <Card.Body className="p-3">
          <div className="d-flex justify-content-between align-items-start">
            {/* Sezione Titolo e Descrizione */}
            <div className="me-3">
              <p className="fw-bold mb-1">{task.taskTitle}</p>
              <p className="text-muted small mb-0">{task.activityDescription}</p>
            </div>
            {/* Sezione Stato */}
            <div className="text-end" style={{ minWidth: "100px" }}>
              <Badge bg="primary" pill className="font-body">
                {formatEnum(task.status)}
              </Badge>
            </div>
          </div>

          <hr className="my-2" />

          {/* SEZIONE DETTAGLI COMPLETI */}
          <Row className="small text-muted">
            <Col md={6}>
              <p className="mb-1">
                <strong>Fase Progetto:</strong> {formatEnum(task.projectPhase)}
              </p>
              <p className="mb-1">
                <strong>Tipo Attività:</strong> {formatEnum(task.activityType)}
              </p>
            </Col>
            <Col md={6}>
              <p className="mb-1">
                <strong>Inizio:</strong> {new Date(task.startDate).toLocaleDateString()}
              </p>
              <p className="mb-1">
                <strong>Fine:</strong> {new Date(task.endDate).toLocaleDateString()}
              </p>
            </Col>
          </Row>
          <Row className="small text-muted mt-1">
            <Col md={6}>
              <p className="mb-1">
                <strong>Effort Stimato:</strong> {task.estimatedEffort} ore
              </p>
            </Col>
            {task.ktEstimate && (
              <Col md={6}>
                <p className="mb-1">
                  <strong>Stima KT:</strong> {task.ktEstimate} ore
                </p>
              </Col>
            )}
          </Row>

          {/* Sezione Staff Assegnato */}
          {assignedProfiles.length > 0 && (
            <div className="mt-2 border-top pt-2">
              <strong className="small text-muted">Team Assegnato:</strong>
              <div className="d-flex flex-wrap align-items-center">
                {assignedProfiles.map((profile) => (
                  <div
                    key={profile.userId}
                    style={{ transform: "scale(0.8)", marginLeft: "-10px", marginRight: "-10px" }}
                  >
                    <UserBadge user={profile} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default TaskCard;
