import { useState, useEffect } from "react";
import { Row, Col, Form, Button, Spinner, Alert } from "react-bootstrap";
import UserBadge from "../Shared/UserBadge";
import { authorizedFetch } from "../../utils/api";
import { API_BASE_URL } from "../../config";
import ConfirmModal from "../Shared/ConfirmModal";
import AdminEditProfileModal from "./AdminEditProfileModal";

const allRoles = ["CONSULTANT", "PROJECT_MANAGER", "SENIOR_MANAGER"];

const UserRow = ({ user, onUserUpdate }) => {
  const [currentRole, setCurrentRole] = useState(user.roles[0]);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCurrentRole(user.roles[0]);
  }, [user.roles]);

  const handleRoleChange = async (e) => {
    const newRole = e.target.value;
    const previousRole = currentRole;
    setCurrentRole(newRole);
    setIsUpdatingRole(true);
    setError("");
    try {
      await authorizedFetch(`${API_BASE_URL}/api/admin/users/${user.userId}/role`, {
        method: "PUT",
        body: JSON.stringify({ roles: [newRole] }),
      });
      onUserUpdate();
    } catch (err) {
      setError(`Errore: ${err.message}`);
      setCurrentRole(previousRole);
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const executeDelete = async () => {
    setShowConfirmDelete(false);
    setError("");
    try {
      await authorizedFetch(`${API_BASE_URL}/api/admin/users/${user.userId}`, { method: "DELETE" });
      alert("Utente eliminato con successo.");
      onUserUpdate();
    } catch (err) {
      setError(`Errore durante l'eliminazione: ${err.message}`);
    }
  };

  return (
    <>
      <div className="p-2 border rounded mb-2">
        {error && (
          <Alert variant="danger" size="sm" className="mb-2">
            {error}
          </Alert>
        )}
        <Row className="align-items-center">
          <Col lg={4} md={12} className="d-flex align-items-center mb-2 mb-md-0">
            <UserBadge user={user} />
          </Col>
          <Col lg={3} md={4}>
            <Form.Select size="sm" value={currentRole} onChange={handleRoleChange} disabled={isUpdatingRole}>
              {allRoles.map((role) => (
                <option key={role} value={role}>
                  {role.replace("_", " ")}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col lg={3} md={4}>
            <div className="text-muted small">Username</div>
            <div>{user.username}</div>
          </Col>
          <Col lg={2} md={4} className="text-end">
            <Button variant="outline-primary" size="sm" onClick={() => setShowEditProfile(true)}>
              {user.profileId ? "Modifica" : "Crea Profilo"}
            </Button>
            <Button variant="outline-danger" size="sm" className="ms-2" onClick={() => setShowConfirmDelete(true)}>
              X
            </Button>
          </Col>
        </Row>
      </div>
      {showEditProfile && (
        <AdminEditProfileModal
          show={showEditProfile}
          handleClose={() => setShowEditProfile(false)}
          userData={user}
          onProfileUpdate={onUserUpdate}
        />
      )}
      <ConfirmModal
        show={showConfirmDelete}
        handleClose={() => setShowConfirmDelete(false)}
        handleConfirm={executeDelete}
        title="Conferma Eliminazione"
        body={`Sei sicuro di voler eliminare l'utente ${user.firstName || user.username}?`}
      />
    </>
  );
};

export default UserRow;
