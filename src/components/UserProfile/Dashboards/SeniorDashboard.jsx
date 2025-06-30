import { useState, useCallback } from "react";
import CreateEmployeeAccordion from "../../Admin/CreateEmployeeAccordion";
import EmployeeManager from "../../Admin/EmployeeManager";
import ProjectsAccordion from "../../Projects/ProjectsAccordion";
import UserProfile from "../UserProfile";

const SeniorDashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUserListUpdate = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  return (
    <div>
      <UserProfile />
      <CreateEmployeeAccordion onUserCreated={handleUserListUpdate} />
      <EmployeeManager key={refreshKey} onUserListUpdate={handleUserListUpdate} />
      <ProjectsAccordion />
    </div>
  );
};

export default SeniorDashboard;
