import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { getProject, getTasks, createNewTask, markTaskComplete } from "../api";

export default function ProjectPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

    try {
      const newTasks = await createNewTask(projectId, name, desc);
      setTasks(newTasks);
    } catch (error) {
      setError(error.message);
    } finally {
      form.reset();
    }
  }

  async function onTaskCheck(e) {
    const target = e.target;
    const taskId = target.name;
    const newTask = await markTaskComplete(taskId, target.checked);
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
    <main>
      <Link to="/projects">view all projects</Link>

      <h1>{project.name}</h1>
      <p>{project.description}</p>

      <section>
        <h2>Tasks</h2>

        {tasks.length === 0 ? (
          <p>No tasks</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                <h2>{task.name}</h2>
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
