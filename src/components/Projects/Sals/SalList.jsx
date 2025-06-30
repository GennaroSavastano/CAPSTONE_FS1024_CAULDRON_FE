import { useState } from "react";
import { Button } from "react-bootstrap";
import AddSalModal from "./AddSalModal";
import SalCard from "./SalCard";
import EditSalModal from "./EditSalModal";

const SalList = ({ sals, projectId, canEdit, onProjectUpdate }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSal, setSelectedSal] = useState(null);

  return (
    <div>
      {canEdit && (
        <div className="text-end mb-2">
          <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
            + Aggiungi SAL
          </Button>
        </div>
      )}

      {sals.length > 0 ? (
        sals.map((sal) => <SalCard key={sal.id} sal={sal} onClick={() => canEdit && setSelectedSal(sal)} />)
      ) : (
        <p className="text-muted small fst-italic">Nessun SAL per questo progetto.</p>
      )}

      <AddSalModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        projectId={projectId}
        onSalAdded={onProjectUpdate}
      />

      {canEdit && selectedSal && (
        <EditSalModal
          show={true}
          handleClose={() => setSelectedSal(null)}
          salData={selectedSal}
          projectId={projectId}
          onSalUpdated={() => {
            onProjectUpdate();
            setSelectedSal(null);
          }}
        />
      )}
    </div>
  );
};

export default SalList;
