import { Card } from "react-bootstrap";

const SalCard = ({ sal, onClick }) => {
  return (
    <div onClick={onClick} style={{ cursor: "pointer" }} className="mb-2">
      <Card>
        <Card.Body className="p-2">
          <p className="fw-bold mb-1">{sal.activityName}</p>
          <p className="text-muted small mb-0">Data: {new Date(sal.scheduledDate).toLocaleDateString()}</p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SalCard;
