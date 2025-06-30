import { useState } from "react";
import { Button } from "react-bootstrap";
import TaskCard from "./TaskCard";
import AddTaskModal from "./AddTaskModal";
import EditTaskModal from "./EditTaskModal";

const TaskList = ({ tasks, projectId, canEdit, assignableUsers, onProjectUpdate }) => {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleCloseEditModal = () => {
    setSelectedTask(null);
  };

  return (
    <div>
      {canEdit && (
        <div className="text-end mb-2">
          <Button variant="primary" size="sm" onClick={() => setShowAddTaskModal(true)}>
            + Aggiungi Task
          </Button>
        </div>
      )}

      {tasks.length > 0 ? (
        tasks.map((task) => {
          const profilesForThisTask = assignableUsers.filter((profile) =>
            task.assignedUsersIds.includes(profile.userId)
          );

          return (
            <TaskCard
              key={task.id}
              task={task}
              assignedProfiles={profilesForThisTask}
              onClick={() => setSelectedTask(task)}
            />
          );
        })
      ) : (
        <p className="text-muted small fst-italic">Nessun task per questo progetto.</p>
      )}

      <AddTaskModal
        show={showAddTaskModal}
        handleClose={() => setShowAddTaskModal(false)}
        projectId={projectId}
        availableStaff={assignableUsers}
        onTaskAdded={onProjectUpdate}
      />

      {selectedTask && (
        <EditTaskModal
          show={true}
          handleClose={handleCloseEditModal}
          taskData={selectedTask}
          projectId={projectId}
          assignableUsers={assignableUsers}
          onTaskUpdated={() => {
            onProjectUpdate();
            handleCloseEditModal();
          }}
        />
      )}
    </div>
  );
};

export default TaskList;
