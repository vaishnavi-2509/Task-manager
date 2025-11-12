"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import TaskCard from "../components/TaskCard"

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [editTaskId, setEditTaskId] = useState(null)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)

  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user"))

  // Fetch user tasks
  const fetchTasks = async () => {
    try {
      setLoading(true)
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTasks(res.data)
      setFilteredTasks(res.data)
    } catch (err) {
      console.error("Error fetching tasks:", err)
    } finally {
      setLoading(false)
    }
  }

  // Add or update task
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      if (editTaskId) {
        await axios.put(
          `http://localhost:5000/api/tasks/${editTaskId}`,
          { title, description: desc },
          { headers: { Authorization: `Bearer ${token}` } },
        )
        setEditTaskId(null)
      } else {
        await axios.post(
          "http://localhost:5000/api/tasks",
          { title, description: desc },
          { headers: { Authorization: `Bearer ${token}` } },
        )
      }
      setTitle("")
      setDesc("")
      fetchTasks()
    } catch (err) {
      console.error("Error saving task:", err)
    } finally {
      setLoading(false)
    }
  }

  // Delete task
  const deleteTask = async (id) => {
    try {
      setLoading(true)
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchTasks()
    } catch (err) {
      console.error("Error deleting task:", err)
    } finally {
      setLoading(false)
    }
  }

  // Edit task
  const editTask = (task) => {
    setEditTaskId(task._id)
    setTitle(task.title)
    setDesc(task.description)
  }

  // Search / filter
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase()
    setSearch(query)
    if (!query) {
      setFilteredTasks(tasks)
    } else {
      setFilteredTasks(
        tasks.filter((t) => t.title.toLowerCase().includes(query) || t.description.toLowerCase().includes(query)),
      )
    }
  }

  // Logout
  const handleLogout = () => {
    localStorage.clear()
    window.location.href = "/"
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Welcome Section */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="inline-block p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Welcome, {user?.name}</h1>
                <p className="text-slate-500 text-sm">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Add/Edit Task Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">{editTaskId ? "Edit Task" : "Create New Task"}</h2>

            {/* Task Title */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                Task Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter task title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                required
              />
            </div>

            {/* Task Description */}
            <div className="mb-5">
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Enter task description..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400 resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {editTaskId ? "Updating..." : "Adding..."}
                </>
              ) : editTaskId ? (
                "Update Task"
              ) : (
                "Add Task"
              )}
            </button>

            {editTaskId && (
              <button
                type="button"
                onClick={() => {
                  setEditTaskId(null)
                  setTitle("")
                  setDesc("")
                }}
                className="w-full mt-2 px-4 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors duration-200"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        {/* Tasks List */}
        <div className="lg:col-span-2">
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search tasks by title or description..."
              value={search}
              onChange={handleSearch}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
            />
          </div>

          {/* Tasks Grid */}
          <div className="space-y-3">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskCard key={task._id} task={task} onEdit={editTask} onDelete={deleteTask} />
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <svg
                  className="w-16 h-16 text-slate-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="text-slate-500 text-lg">No tasks found</p>
                <p className="text-slate-400 text-sm mt-1">Create your first task to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
