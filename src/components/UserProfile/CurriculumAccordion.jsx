import { useState } from "react";
import { Accordion, Button, Alert, Spinner } from "react-bootstrap";
import EditCurriculumModal from "./EditCurriculModal";
import { authorizedFetch } from "../../utils/api";

const CurriculumAccordion = ({ curriculumData, profileId, onCurriculumUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isButtonDisabled = !profileId;
  const isCurriculumEmpty = !curriculumData?.id;

  const handleCloseModal = () => setShowModal(false);

  const handleButtonClick = async () => {
    if (isButtonDisabled) return;
    setError("");

    if (isCurriculumEmpty) {
      setIsLoading(true);
      try {
        const response = await authorizedFetch(`http://localhost:8080/api/curricula/create/${profileId}`, {
          method: "POST",
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "Errore nella creazione del curriculum.");
        }

        onCurriculumUpdate();
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <Accordion defaultActiveKey="0" className="accordion_width">
        <Accordion.Item>
          <Accordion.Header className="accordion-header-custom">
            <span className="font-title">Curriculum</span>
          </Accordion.Header>
          <Accordion.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <div className="text-end mb-3">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleButtonClick}
                disabled={isButtonDisabled || isLoading}
                title={
                  isButtonDisabled
                    ? "Completa il tuo profilo per creare un curriculum"
                    : "Crea o modifica il curriculum"
                }
              >
                {isLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : isCurriculumEmpty ? (
                  "Crea Curriculum"
                ) : (
                  "Modifica Curriculum"
                )}
              </Button>
            </div>

            {isButtonDisabled ? (
              <Alert variant="info">
                Per creare il tuo curriculum, devi prima completare e salvare il tuo profilo.
              </Alert>
            ) : isCurriculumEmpty ? (
              <Alert variant="warning">
                Non hai ancora creato un curriculum. Clicca su "Crea Curriculum" per iniziare.
              </Alert>
            ) : (
              <div>
                <h5 className="font-title">Titoli di Studio</h5>
                {curriculumData.qualifications?.length > 0 ? (
                  curriculumData.qualifications.map((q) => (
                    <p key={q.id} className="mb-1">
                      - {q.nomeTitolo} presso {q.istituto}
                    </p>
                  ))
                ) : (
                  <p className="text-muted fst-italic">Nessun titolo di studio aggiunto.</p>
                )}
                <hr />
                <h5 className="font-title">Esperienze Professionali</h5>
                {curriculumData.professionalExperiences?.length > 0 ? (
                  curriculumData.professionalExperiences.map((exp) => (
                    <p key={exp.id} className="mb-1">
                      - <strong>{exp.context}:</strong> {exp.experienceDescription}
                    </p>
                  ))
                ) : (
                  <p className="text-muted fst-italic">Nessuna esperienza aggiunta.</p>
                )}
                <hr />
                <h5 className="font-title">Competenze Tecniche</h5>
                {curriculumData.competencies?.length > 0 ? (
                  curriculumData.competencies.map((c) => (
                    <p key={c.id} className="mb-1">
                      - {c.nome} (Livello: {c.livello}/5)
                    </p>
                  ))
                ) : (
                  <p className="text-muted fst-italic">Nessuna competenza aggiunta.</p>
                )}
                <hr />
                <h5 className="font-title">Certificazioni</h5>
                {curriculumData.certifications?.length > 0 ? (
                  curriculumData.certifications.map((c) => (
                    <p key={c.id} className="mb-1">
                      - {c.name}
                    </p>
                  ))
                ) : (
                  <p className="text-muted fst-italic">Nessuna certificazione aggiunta.</p>
                )}
                <hr />
                <h5 className="font-title">Lingue</h5>
                {curriculumData.languages?.length > 0 ? (
                  curriculumData.languages.map((l) => (
                    <p key={l.id} className="mb-1">
                      - {l.languageName} (Livello: {l.level})
                    </p>
                  ))
                ) : (
                  <p className="text-muted fst-italic">Nessuna lingua aggiunta.</p>
                )}
              </div>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {showModal && (
        <EditCurriculumModal
          show={showModal}
          handleClose={handleCloseModal}
          curriculumData={curriculumData}
          onCurriculumUpdate={onCurriculumUpdate}
        />
      )}
    </>
  );
};

export default CurriculumAccordion;
