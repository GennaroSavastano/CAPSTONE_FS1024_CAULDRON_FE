import { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { authorizedFetch } from "../../../utils/api";

const EditSalModal = ({ show, handleClose, salData, projectId, onSalUpdated }) => {
  const [formData, setFormData] = useState({ scheduledDate: "", activityName: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (salData) {
      setFormData({
        scheduledDate: salData.scheduledDate || "",
        activityName: salData.activityName || "",
      });
    }
  }, [salData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await authorizedFetch(`http://localhost:8080/api/projects/${projectId}/sals/${salData.id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Errore durante l'aggiornamento del SAL.");
      alert("SAL aggiornato con successo.");
      onSalUpdated();
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Sei sicuro di voler eliminare questo SAL: "${salData.activityName}"?`)) {
      setIsLoading(true);
      setError("");
      try {
        await authorizedFetch(`http://localhost:8080/api/projects/${projectId}/sals/${salData.id}`, {
          method: "DELETE",
        });
        alert("SAL eliminato con successo.");
        onSalUpdated();
        handleClose();
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="font-title">Modifica SAL</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Data Schedulata</Form.Label>
            <Form.Control
              type="date"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nome Attività</Form.Label>
            <Form.Control
              type="text"
              name="activityName"
              value={formData.activityName}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="danger" onClick={handleDelete} disabled={isLoading}>
          Elimina
        </Button>
        <div>
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            Annulla
          </Button>
          <Button variant="primary" onClick={handleSaveChanges} disabled={isLoading} className="ms-2">
            {isLoading ? <Spinner as="span" size="sm" /> : "Salva Modifiche"}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default EditSalModal;
