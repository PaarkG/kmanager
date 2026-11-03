import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import {
  getProject,
  getTasks,
  createTask,
  updateTaskComplete,
  updateTask,
} from "../api";
import "./project.css";

export default function ProjectPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formIssue, setFormIssue] = useState("");

  useEffect(() => {
    async function loadPage() {
      setLoading(true);
      setError("");

      try {
        const [projectData, taskData] = await Promise.all([
          getProject(projectId),
          getTasks(projectId),
        ]);

        setProject(projectData);
        setTasks(taskData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, [projectId]);

  async function onFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const name = formData.get("name");
    const desc = formData.get("desc");

    if (name) {
      try {
        const newTasks = await createTask(projectId, name, desc);
        setTasks(newTasks);
      } catch (error) {
        setError(error.message);
      } finally {
        form.reset();
      }
    } else {
      setFormIssue("New tasks must be named.");
    }
  }

  async function onTaskCheck(e) {
    const target = e.target;
    const taskId = target.name;
    const newTask = await updateTaskComplete(taskId, target.checked);
    const newTasks = tasks.filter((t) => t.id != taskId);
    newTasks.push(newTask);
    newTasks.sort((t1, t2) => t1.id - t2.id);
    setTasks(newTasks);
  }

  if (loading) return <p>Project {projectId} is loading...</p>;
  if (error)
    return (
      <p>
        Error loading project {projectId}: {error}
      </p>
    );
  if (!project) return <p>Project {projectId} not found...</p>;

  return (
    <main className="project">
      <Link to="/projects">view all projects</Link>

      <h1>{project.name}</h1>
      <p>{project.desc}</p>

      <section>
        <h2>Tasks</h2>

        {tasks.length === 0 ? (
          <p>No tasks</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                <h3>{task.name}</h3>
                <p>{task.desc}</p>
                <input
                  type="checkbox"
                  name={task.id}
                  checked={task.completed}
                  onChange={onTaskCheck}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h2>new task</h2>
        <form onSubmit={onFormSubmit}>
          <label>
            <span>name</span>
            <input type="text" name="name" />
          </label>

          <label>
            <span />
            <span>desc</span>
            <span />
            <input type="text" name="desc" />
            <span />
          </label>

          <button>submit</button>
        </form>
        {formIssue ? <p>{formIssue}</p> : null}
      </section>
    </main>
  );
}
