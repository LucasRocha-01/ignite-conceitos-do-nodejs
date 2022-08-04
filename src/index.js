const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users =
  // [];
  [
    {
      id: "42b4e867-81d1-419d-881c-9023749cc722",
      name: "Lucas",
      username: "Skyter",
      todos: [
        {
          id: "b72283fc-588d-4bbe-9fc1-6eaa3c3a0039",
          title: "Bruce Way",
          done: false,
          deadline: null,
          created_at: "2022-08-04T03:13:00.860Z",
        },
      ],
    },
  ];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(400).json({ error: "User not found!" });
  }

  request.user = user;

  return next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const usernameExists = users.find((user) => user.username === username);

  if (usernameExists) {
    return response.status(400).json({ error: "Username already exists" });
  }

  const user = { id: uuidv4(), name, username, todos: [] };

  users.push(user);

  return response.status(400).json(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(newTodo);

  return response.status(201).json(newTodo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { id } = request.params;
  const { user } = request;

  const existToDo = user.todos.find((todo) => todo.id === id);

  if (!existToDo) {
    return response.status(404).json({ error: "todo not found!" });
  }

  user.todos.map((todo) => {
    if (todo.id === id) {
      todo.title = title;
      todo.deadline = deadline;
    }
  });

  return response.status(200).json(existToDo);
});

app.get("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;

  const todo = user.todos;
  // const existToDo = todo.find((todo) => todo.id === id);

  // if (!existToDo) {
  //   return response.status(400).json({ error: "todo not found!" });
  // }

  const usert = todo.find((todo) => todo.id === id);

  return response.status(200).json(usert);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;

  const existToDo = user.todos.find((todo) => todo.id === id);

  if (!existToDo) {
    return response.status(404).json({ error: "todo not found!" });
  }
  let todoAt = "";
  user.todos.map((todo) => {
    if (todo.id === id) {
      todo.done = true;

      todoAt = todo;
    }
  });

  return response.status(200).json(todoAt);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;

  const existToDo = user.todos.find((todo) => todo.id === id);

  if (!existToDo) {
    return response.status(404).json({ error: "todo not found!" });
  }

  const indexToDo = user.todos.findIndex((todo) => todo.id === id);

  user.todos.splice(indexToDo, 1);

  return response.status(204).json(user);
});

module.exports = app;
