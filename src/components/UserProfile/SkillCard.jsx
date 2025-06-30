import { Card, Badge, Button } from "react-bootstrap";
import "../../App.css";

const SkillCard = ({ skill, onRemove }) => {
  const renderLevelDots = (level) => {
    let dots = [];
    for (let i = 1; i <= 5; i++) {
      dots.push(<span key={i} className={`dot ${i <= level ? "filled" : ""}`}></span>);
    }
    return dots;
  };

  return (
    <Card className="mb-2">
      <Card.Body className="d-flex justify-content-between align-items-center p-2">
        <div className="d-flex align-items-center justify-content-start">
          <span className="badge-wrapper">
            <Badge bg="secondary">{skill.type.replaceAll("_", " ")}</Badge>
          </span>
          <div className="dots-wrapper me-2">{renderLevelDots(skill.level)}</div>
        </div>
        <Button variant="outline-danger" size="sm" onClick={() => onRemove(skill.id)}>
          &times;
        </Button>
      </Card.Body>
    </Card>
  );
};

export default SkillCard;
