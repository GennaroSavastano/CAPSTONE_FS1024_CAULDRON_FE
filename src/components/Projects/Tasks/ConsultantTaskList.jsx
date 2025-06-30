import { useState, useEffect, useCallback } from "react";
import { Spinner, Alert } from "react-bootstrap";
import { authorizedFetch } from "../../../utils/api";
import ConsultantTaskCard from "./ConsultantTaskCard";

const ConsultantTaskList = ({ projectId, assignableUsers }) => {
  const [myTasks, setMyTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyTasks = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await authorizedFetch(`http://localhost:8080/api/projects/${projectId}/tasks/my-tasks`);
      if (!response.ok) throw new Error("Errore nel caricamento dei tuoi task.");
      const data = await response.json();
      setMyTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMyTasks();
  }, [fetchMyTasks]);

  return (
    <div>
      {isLoading && (
        <div className="text-center">
          <Spinner size="sm" />
        </div>
      )}
      {error && (
        <Alert variant="danger" size="sm">
          {error}
        </Alert>
      )}
      {!isLoading && myTasks.length > 0
        ? myTasks.map((task) => {
            const profilesForThisTask = assignableUsers.filter((profile) =>
              task.assignedUsersIds.includes(profile.userId)
            );
            return (
              <ConsultantTaskCard
                key={task.id}
                task={task}
                assignedProfiles={profilesForThisTask}
                onStatusChange={fetchMyTasks}
              />
            );
          })
        : !isLoading && <p className="text-muted small fst-italic">Nessun task assegnato a te per questo progetto.</p>}
    </div>
  );
};

export default ConsultantTaskList;
