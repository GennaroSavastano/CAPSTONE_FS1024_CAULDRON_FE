import { Card, Button } from "react-bootstrap";

const CurriculumItemCard = ({ item, onRemove, children }) => {
  return (
    <Card className="mb-2">
      <Card.Body className="d-flex justify-content-between align-items-center p-2">
        <div>{children}</div>
        <Button variant="outline-danger" size="sm" onClick={() => onRemove(item.id)}>
          &times;
        </Button>
      </Card.Body>
    </Card>
  );
};

export default CurriculumItemCard;
