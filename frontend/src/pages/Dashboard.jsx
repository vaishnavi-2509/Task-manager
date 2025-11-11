import axios from "axios";
import { useState, useEffect } from "react";
import TaskCard from "../components/TaskCard";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Add or update task
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editTaskId) {
        await axios.put(
          `http://localhost:5000/api/tasks/${editTaskId}`,
          { title, description: desc },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditTaskId(null);
      } else {
        await axios.post(
          "http://localhost:5000/api/tasks",
          { title, description: desc },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setTitle("");
      setDesc("");
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit a task
  const editTask = (task) => {
    setEditTaskId(task._id);
    setTitle(task.title);
    setDesc(task.description);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          className="border p-2 flex-1 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className="border p-2 flex-1 rounded"
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {editTaskId ? "Update" : "Add"}
        </button>
      </form>

      {/* Task List */}
      <div className="grid gap-3">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onDelete={deleteTask}
              onEdit={editTask}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center">No tasks found.</p>
        )}
      </div>
    </div>
  );
}
