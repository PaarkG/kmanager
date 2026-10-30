import { useState, useEffect } from "react";
import { getProjects, createNewProject } from "../api";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPage() {
      setLoading(true);
      setError("");

      const projects = await getProjects();
      try {
        setProjects(projects);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, []);

  async function onFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const name = formData.get("name");
    const desc = formData.get("desc");

    try {
      const newProjects = await createNewProject(name, desc);
      setProjects(newProjects);
    } catch (error) {
      setError(error.message);
    } finally {
      form.reset();
    }
  }

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>Error loading projects: {error}</p>;

  return (
    <main>
      <h1>Projects</h1>
      {projects.length === 0 ? (
        <p>No projects yet...</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <a href={`/projects/${project.id}`}>{project.name}</a>
            </li>
          ))}
        </ul>
      )}
      <section>
        <h2>new project</h2>
        <form onSubmit={onFormSubmit}>
          <label>name</label>
          <input type="text" name="name" />
          <label>desc</label>
          <input type="text" name="desc" />
          <button>submit</button>
        </form>
      </section>
    </main>
  );
}
