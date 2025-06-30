import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginModal from "../components/LoginModal";
import logo from "../assets/svg/logo_home.svg";

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const roles = user.roles;
      if (roles.includes("SENIOR_MANAGER")) {
        navigate("/senior-manager");
      } else if (roles.includes("PROJECT_MANAGER")) {
        navigate("/project-manager");
      } else if (roles.includes("CONSULTANT")) {
        navigate("/consultant");
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="home-page">
      <img className="logo_home" src={logo} alt="Cauldron Logo" onClick={!isAuthenticated ? handleShowModal : null} />

      <LoginModal show={showModal} handleClose={handleCloseModal} />
    </div>
  );
};

export default HomePage;
