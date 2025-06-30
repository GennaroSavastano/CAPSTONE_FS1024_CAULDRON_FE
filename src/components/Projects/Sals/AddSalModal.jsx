import { useState } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { authorizedFetch } from "../../../utils/api";

const AddSalModal = ({ show, handleClose, projectId, onSalAdded }) => {
  const [formData, setFormData] = useState({ scheduledDate: "", activityName: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSal = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await authorizedFetch(`http://localhost:8080/api/projects/${projectId}/sals`, {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Errore durante la creazione del SAL.");
      onSalAdded();
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="font-title">Aggiungi Nuovo SAL</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Data Schedulata</Form.Label>
            <Form.Control type="date" name="scheduledDate" onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nome Attività</Form.Label>
            <Form.Control
              type="text"
              name="activityName"
              placeholder="Es. Approvazione Requisiti"
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Annulla
        </Button>
        <Button variant="primary" onClick={handleAddSal} disabled={isLoading}>
          {isLoading ? <Spinner as="span" size="sm" /> : "Aggiungi SAL"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddSalModal;
