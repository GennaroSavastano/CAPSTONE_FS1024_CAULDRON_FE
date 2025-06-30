import { useState, useEffect, useCallback } from "react";
import { Accordion, Form, Spinner, Alert } from "react-bootstrap";
import { authorizedFetch } from "../../utils/api";
import { API_BASE_URL } from "../../config";
import UserRow from "./UserRow";

const EmployeeManager = ({ refreshTrigger, onUserListUpdate }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAllUsers = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await authorizedFetch(`${API_BASE_URL}/api/admin/users/details`);
      if (!response.ok) throw new Error("Errore nel caricamento della lista dipendenti.");
      const data = await response.json();
      setAllUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers, refreshTrigger]);

  useEffect(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = allUsers.filter((user) =>
      Object.values(user).some((val) => String(val).toLowerCase().includes(lowercasedTerm))
    );
    setFilteredUsers(filtered);
  }, [searchTerm, allUsers]);

  return (
    <Accordion className="mt-4 accordion_width" defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header className="accordion-header-custom">
          <span className="font-title">Gestione Dipendenti</span>
        </Accordion.Header>
        <Accordion.Body>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Cerca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
          {isLoading && (
            <div className="text-center">
              <Spinner />
            </div>
          )}
          {error && <Alert variant="danger">{error}</Alert>}
          {!isLoading &&
            filteredUsers.map((user) => <UserRow key={user.userId} user={user} onUserUpdate={onUserListUpdate} />)}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default EmployeeManager;
