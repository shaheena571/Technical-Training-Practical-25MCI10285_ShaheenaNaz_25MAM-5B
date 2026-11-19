import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // get the user we saved at login time
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // runs once when the page opens
  useEffect(() => {
    getTasks();
  }, []);

  async function getTasks() {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      // 401 means token is bad or expired, so log the user out
      if (err.response?.status === 401) {
        handleLogout();
      } else {
        setError("Could not load tasks");
      }
    }
    setLoading(false);
  }

  async function addTask(e) {
    e.preventDefault();
    if (newTask.trim() === "") return;

    try {
      const res = await API.post("/tasks", { title: newTask });
      // put the new task at the top of the list
      setTasks([res.data, ...tasks]);
      setNewTask("");
    } catch (err) {
      setError("Could not add task");
    }
  }

  async function toggleTask(id) {
    try {
      const res = await API.put("/tasks/" + id);
      // replace the old task with the updated one
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      setError("Could not update task");
    }
  }

  async function deleteTask(id) {
    try {
      await API.delete("/tasks/" + id);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      setError("Could not delete task");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  // simple numbers for the top cards
  const doneCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - doneCount;

  return (
    <div>
      <nav className="navbar">
        <h3>Task Manager</h3>
        <div>
          <span className="username">Hi, {user.name}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        <div className="stats">
          <div className="stat-box">
            <h2>{tasks.length}</h2>
            <p>Total</p>
          </div>
          <div className="stat-box">
            <h2>{pendingCount}</h2>
            <p>Pending</p>
          </div>
          <div className="stat-box">
            <h2>{doneCount}</h2>
            <p>Done</p>
          </div>
        </div>

        <form className="add-form" onSubmit={addTask}>
          <input
            type="text"
            placeholder="What do you need to do?"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>

        {error && <p className="error">{error}</p>}

        {loading ? (
          <p>Loading your tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="empty">No tasks yet. Add your first one above!</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task._id} className="task-item">
                <span
                  className={task.completed ? "task-title done" : "task-title"}
                  onClick={() => toggleTask(task._id)}
                >
                  {task.title}
                </span>
                <button className="delete-btn" onClick={() => deleteTask(task._id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
