import { Image } from "react-bootstrap";
import "../../App.css";

const UserBadge = ({ user }) => {
  if (!user) return null;

  const getAvatarFallback = (firstName, lastName) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `https://dummyimage.com/60x60/cdc1ff/7371FC.png&text=${firstInitial}${lastInitial}`;
  };

  return (
    <div className="d-flex align-items-center me-3 mb-2" style={{ minWidth: "250px" }}>
      <Image
        src={user.avatarUrl || getAvatarFallback(user.firstName, user.lastName)}
        roundedCircle
        className="user-badge-avatar"
      />
      <div className="ms-2">
        <div className="fw-bold">
          {user.firstName} {user.lastName}
        </div>
        <small className="text-muted">{user.funcionalFigure?.replaceAll("_", " ")}</small>
      </div>
    </div>
  );
};

export default UserBadge;
