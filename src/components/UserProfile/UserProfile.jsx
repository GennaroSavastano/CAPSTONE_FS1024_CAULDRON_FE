import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col, Image, Badge, Spinner } from "react-bootstrap";
import ProfileAccordion from "./ProfileAccordion";
import CurriculumAccordion from "./CurriculumAccordion";
import "../../App.css";

const UserProfile = () => {
  const { token } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAllData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const profileResponse = await fetch("http://localhost:8080/api/profiles/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (profileResponse.status === 404) {
        setProfile(null);
        setCurriculum(null);
        setLoading(false);
        return;
      }

      if (!profileResponse.ok) {
        throw new Error("Errore nel caricamento del profilo.");
      }

      const profileData = await profileResponse.json();
      setProfile(profileData);

      if (profileData.curriculumId) {
        const curriculumResponse = await fetch(`http://localhost:8080/api/curricula/${profileData.curriculumId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (curriculumResponse.ok) {
          const curriculumData = await curriculumResponse.json();
          setCurriculum(curriculumData);
        }
      } else {
        setCurriculum(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  if (loading && !profile) {
    return <p className="text-center mt-5">Caricamento del profilo in corso...</p>;
  }

  if (error) return <p className="text-center text-danger mt-5">{error}</p>;

  return (
    <Container className="my-4">
      <Row className="align-items-center mb-4">
        <Col xs="auto">
          <Image
            src={profile?.avatarUrl || "https://dummyimage.com/200x200/cdc1ff/7371FC.png&text=Avatar"}
            roundedCircle
            className="profile-avatar"
          />
        </Col>
        <Col>
          <div className="d-flex align-items-center">
            <h2 className="font-title mb-0 me-3">
              {`${profile?.firstName || "Benvenuto"}`} {profile?.lastName}
            </h2>
            {loading && <Spinner animation="border" size="sm" />}
          </div>
          {profile?.funcionalFigure ? (
            <Badge bg="secondary" className="font-body mt-2">
              {profile.funcionalFigure.replaceAll("_", " ")}
            </Badge>
          ) : (
            <Badge bg="warning" text="dark" className="font-body mt-2">
              Profilo da completare
            </Badge>
          )}
        </Col>
      </Row>

      <ProfileAccordion profileData={profile} onProfileUpdate={fetchAllData} />
      <CurriculumAccordion curriculumData={curriculum} profileId={profile?.id} onCurriculumUpdate={fetchAllData} />
    </Container>
  );
};

export default UserProfile;
