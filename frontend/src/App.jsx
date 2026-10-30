import ProjectsPage from "./pages/ProjectsPage";
import ProjectPage from "./pages/ProjectPage";
import { BrowserRouter, Routes, Route } from "react-router";

const status = await fetch("http://localhost:3000/alive");
const json = await status.json();
console.log(json["message"]);

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<ProjectsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectPage />} />
        </Routes>
      </BrowserRouter>
      {}
    </>
  );
}

export default App;
