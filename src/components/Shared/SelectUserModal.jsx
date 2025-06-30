import { useState, useEffect } from "react";
import { Modal, Button, Card, Row, Col, Image } from "react-bootstrap";
import "../../App.css";

const SelectUserModal = ({ show, handleClose, usersToShow, onConfirmSelection, initialSelectedIds = [] }) => {
  const [selectedIds, setSelectedIds] = useState(new Set());

  useEffect(() => {
    if (show) {
      setSelectedIds(new Set(initialSelectedIds));
    }
  }, [show, initialSelectedIds]);

  const handleCardClick = (userId) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(userId)) {
      newSelectedIds.delete(userId);
    } else {
      newSelectedIds.add(userId);
    }
    setSelectedIds(newSelectedIds);
  };

  const handleConfirm = () => {
    onConfirmSelection(Array.from(selectedIds));
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="font-title">Seleziona Utenti</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
        <Row>
          {usersToShow &&
            usersToShow.map((user) => (
              <Col md={4} key={user.userId} className="mb-3">
                <Card
                  className={`user-card ${selectedIds.has(user.userId) ? "selected" : ""}`}
                  onClick={() => handleCardClick(user.userId)}
                >
                  <Card.Body className="text-center">
                    <Image
                      src={
                        user.avatarUrl ||
                        `https://dummyimage.com/100x100/cdc1ff/7371FC.png&text=${user.firstName?.charAt(0)}`
                      }
                      roundedCircle
                      width={80}
                      height={80}
                    />
                    <Card.Title className="mt-2 h6">
                      {user.firstName} {user.lastName}
                    </Card.Title>
                    <Card.Text className="text-muted small">{user.funcionalFigure?.replaceAll("_", " ")}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Annulla
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Conferma Selezione
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SelectUserModal;
