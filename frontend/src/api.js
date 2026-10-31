const URL = "http://localhost:3000";

export async function getProjects() {
  const response = await fetch(`${URL}/projects`, { method: "GET" });
  if (!response.ok) throw new Error("Failed to fetch projects");
  return response.json();
}

export async function getProject(projectId) {
  const response = await fetch(`${URL}/projects/${projectId}`, {
    method: "GET",
  });
  if (!response.ok) throw new Error(`Failed to fetch project ${projectId}`);
  return response.json();
}

export async function getTasks(projectId) {
  const response = await fetch(`${URL}/projects/${projectId}/tasks`, {
    method: "GET",
  });
  if (!response.ok)
    throw new Error(`Failed to fetch tasks for project ${projectId}`);
  return response.json();
}

export async function createNewProject(name, desc) {
  const response = await fetch(`${URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      desc: desc,
    }),
  });

  if (!response.ok) throw new Error(`Failed to create new project`);
  return response.json();
}

export async function createTask(projectId, name, desc) {
  const response = await fetch(`${URL}/projects/${projectId}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      desc: desc,
    }),
  });

  if (!response.ok)
    throw new Error(`Failed to create new task in project ${projectId}`);
  return response.json();
}

export async function updateTask(taskId, body) {
  const response = await fetch(`${URL}/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to update task ${taskId}`);
  }
  return response;
}

export async function updateTaskComplete(taskId, completed) {
  const response = await updateTask(taskId, { completed: completed });
  if (!response.ok) {
    throw new Error(`Failed to mark task ${taskId} as complete`);
  }
  return response.json();
}
