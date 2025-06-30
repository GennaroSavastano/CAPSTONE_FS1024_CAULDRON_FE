import { useState } from "react";
import { Accordion, Button, Alert } from "react-bootstrap";
import EditProfileModal from "./EditProfileModal";

const ProfileAccordion = ({ profileData, onProfileUpdate }) => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const isProfileEmpty = !profileData?.id;

  const renderLevelDots = (level) => {
    let dots = [];
    for (let i = 1; i <= 5; i++) {
      dots.push(<span key={i} className={`dot ${i <= level ? "filled" : ""}`}></span>);
    }
    return dots;
  };

  return (
    <>
      <Accordion defaultActiveKey="0" className="mb-3">
        <Accordion.Item>
          <Accordion.Header className="accordion-header-custom">
            <span className="font-title">Profilo</span>
          </Accordion.Header>
          <Accordion.Body>
            <div className="text-end mb-3">
              <Button className="btn-outline-primary" size="sm" onClick={handleOpenModal}>
                {isProfileEmpty ? "Crea Profilo" : "Modifica Profilo"}
              </Button>
            </div>

            {isProfileEmpty ? (
              <Alert variant="warning">
                Il tuo profilo non è stato ancora creato. Clicca su "Crea Profilo" per iniziare.
              </Alert>
            ) : (
              <div>
                <p>
                  <strong>Email:</strong> {profileData.email}
                </p>
                <p>
                  <strong>Città:</strong> {profileData.city}, {profileData.country}
                </p>
                <p>
                  <strong>Telefono:</strong> {profileData.phoneNumber}
                </p>
                <p>
                  <strong>Portfolio:</strong>{" "}
                  <a href={profileData.portfolioLink} target="_blank" rel="noopener noreferrer">
                    {profileData.portfolioLink}
                  </a>
                </p>

                <hr />
                <h6 className="font-title">Skills</h6>
                {profileData.skills?.length > 0 ? (
                  profileData.skills.map((skill) => (
                    <div key={skill.id} className="d-flex align-items-center mb-1">
                      <span className="me-2" style={{ minWidth: "230px" }}>
                        {skill.type.replaceAll("_", " ")}:
                      </span>
                      <div>{renderLevelDots(skill.level)}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted fst-italic">Nessuna skill aggiunta.</p>
                )}
              </div>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {showModal && (
        <EditProfileModal
          show={showModal}
          handleClose={handleCloseModal}
          profileData={profileData}
          onProfileUpdate={onProfileUpdate}
        />
      )}
    </>
  );
};

export default ProfileAccordion;
