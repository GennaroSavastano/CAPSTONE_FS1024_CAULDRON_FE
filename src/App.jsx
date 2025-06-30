import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopBar from "./components/TopBar";
import HomePage from "./components/HomePage";
import ConsultantDashboard from "./components/UserProfile/Dashboards/ConsultantDashboard";
import PmDashboard from "./components/UserProfile/Dashboards/PmDashboard";
import SeniorDashboard from "./components/UserProfile/Dashboards/SeniorDashboard";
import ProjectDetailPage from "./components/Projects/ProjectDetailPage";

function App() {
  return (
    <BrowserRouter>
      <TopBar />
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Route per le dashboard dei ruoli */}
        <Route path="/consultant" element={<ConsultantDashboard />} />
        <Route path="/project-manager" element={<PmDashboard />} />
        <Route path="/senior-manager" element={<SeniorDashboard />} />

        {/* ROTTA PER IL DETTAGLIO DEL PROGETTO */}
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
