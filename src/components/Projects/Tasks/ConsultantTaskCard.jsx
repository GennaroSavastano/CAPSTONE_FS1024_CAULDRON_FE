import { useState } from "react";
import { Card, Badge, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import UserBadge from "../../Shared/UserBadge";
import { authorizedFetch } from "../../../utils/api";

const taskStatuses = ["TO_DO", "IN_PROGRESS", "DONE"];

const ConsultantTaskCard = ({ task, assignedProfiles = [], onStatusChange }) => {
  const [currentStatus, setCurrentStatus] = useState(task.status);
  const [isLoading, setIsLoading] = useState(false);

  const formatEnum = (text) => {
    if (!text) return "";
    return text
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setIsLoading(true);
    try {
      await authorizedFetch(
        `http://localhost:8080/api/projects/${task.projectId}/tasks/${task.id}/updateStatus?newStatus=${newStatus}`,
        {
          method: "PATCH",
        }
      );
      setCurrentStatus(newStatus);
      onStatusChange();
    } catch (error) {
      console.error("Failed to update task status", error);
      alert("Errore nell'aggiornamento dello stato.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-2">
      <Card.Body className="p-3">
        <div className="d-flex justify-content-between align-items-start">
          <div className="me-3">
            <p className="fw-bold mb-1">{task.taskTitle}</p>
            <p className="text-muted small mb-0">{task.activityDescription}</p>
          </div>
          <div className="text-end" style={{ minWidth: "150px" }}>
            {isLoading ? (
              <Spinner size="sm" />
            ) : (
              <Form.Select size="sm" value={currentStatus} onChange={handleStatusChange}>
                {taskStatuses.map((s) => (
                  <option key={s} value={s}>
                    {formatEnum(s)}
                  </option>
                ))}
              </Form.Select>
            )}
          </div>
        </div>

        <hr className="my-2" />

        <Row className="small text-muted">
          <Col md={6}>
            <p className="mb-1">
              <strong>Fase Progetto:</strong> {formatEnum(task.projectPhase)}
            </p>
          </Col>
          <Col md={6}>
            <p className="mb-1">
              <strong>Tipo Attività:</strong> {formatEnum(task.activityType)}
            </p>
          </Col>
        </Row>
        <Row className="small text-muted mt-1">
          <Col md={6}>
            <p className="mb-1">
              <strong>Inizio:</strong> {new Date(task.startDate).toLocaleDateString()}
            </p>
          </Col>
          <Col md={6}>
            <p className="mb-1">
              <strong>Fine:</strong> {new Date(task.endDate).toLocaleDateString()}
            </p>
          </Col>
        </Row>

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
  );
};

export default ConsultantTaskCard;
