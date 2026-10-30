const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

let projects = [
  {
    id: 1,
    name: "Project 1",
    desc: "This is the first project",
    tasks: [1, 2],
  },
  {
    id: 2,
    name: "Project 2",
    desc: "This is the second project",
    tasks: [3, 4, 5],
  },
];
let nextProjectId = 3;

let tasks = [
  {
    id: 1,
    name: "Task 1",
    desc: "This is the first task",
    completed: false,
  },
  {
    id: 2,
    name: "Task 2",
    desc: "This is the second task",
    completed: false,
  },
  {
    id: 3,
    name: "Task 3",
    desc: "This is the third task",
    completed: false,
  },
  {
    id: 4,
    name: "Task 4",
    desc: "This is the fourth task",
    completed: false,
  },
  {
    id: 5,
    name: "Task 5",
    desc: "This is the fifth task",
    completed: false,
  },
];
let nextTaskId = 6;

// helpers
function getProjectById(projectId) {
  for (const project of projects) {
    if (project.id == projectId) {
      return project;
    }
  }
}

function getTaskById(taskId) {
  for (const task of tasks) {
    if (task.id == taskId) {
      return task;
    }
  }
}

app.use(cors());
app.use(express.json());

app.get("/alive", (req, res) => {
  res.json({ message: "alive!" });
});

// PROJECTS
app.get("/projects", (req, res) => {
  res.json(projects);
});

app.post("/projects", (req, res) => {
  const projectContent = req.body;
  const project = {
    id: nextProjectId,
    name: projectContent.name,
    desc: projectContent.desc,
    tasks: [],
  };
  nextProjectId++;
  projects.push(project);
  res.json(projects);
});

// PROJECTS/:PROJECTID
app.get("/projects/:projectId", (req, res) => {
  const projectId = req.params.projectId;
  const project = getProjectById(projectId);
  if (!project) {
    res.status(404);
    res.send(`Project ${projectId} was not found`);
  } else {
    res.status(200).json(project);
  }
});

app.patch("/projects/:projectId", (req, res) => {
  const projectId = req.params.projectId;
  const project = getProjectById(projectId);
  if (!project) {
    res.status(404);
    res.send(`Project ${projectId} was not found`);
  } else {
    const body = req.body;
    if ("name" in body) {
      project.name = body.name;
    }

    if ("desc" in body) {
      project.desc = body.desc;
    }

    res.status(200).json(project);
  }
});

// PROJECTS/:PROJECTID/TASKS
app.get("/projects/:projectId/tasks", (req, res) => {
  const projectId = req.params.projectId;
  const project = getProjectById(projectId);
  if (!project) {
    res.status(404).send(`Project ${projectId} was not found`);
  } else {
    const projectTasks = tasks.filter((task) => project.tasks.includes(task.id));
    res.status(200).json(projectTasks);
  }
});

app.post("/projects/:projectId/tasks", (req, res) => {
  const projectId = req.params.projectId;
  const project = getProjectById(projectId);
  const taskContent = req.body;

  if (!project) {
    res.status(404).send(`Project ${projectId} was not found`);
  } else {
    project.tasks.push(nextTaskId);
    const task = {
      id: nextTaskId,
      name: taskContent.name,
      desc: taskContent.desc,
      completed: false,
    };
    nextTaskId++;

    tasks.push(task);

    const projectTasks = tasks.filter((task) => project.tasks.includes(task.id));
    res.status(200).json(projectTasks);
  }
});

// TASKS/:TASKID
app.patch("/tasks/:taskId", (req, res) => {
  const taskId = req.params.taskId;
  const task = getTaskById(taskId);
  if (!task) {
    res.status(404).send(`Task ${taskId} was not found`);
  } else {
    const body = req.body;
    if ("name" in body) {
      task.name = body.name;
    }

    if ("desc" in body) {
      task.desc = body.desc;
    }

    if ("completed" in body) {
      task.completed = body.completed;
    }

    res.status(200).json(task);
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
