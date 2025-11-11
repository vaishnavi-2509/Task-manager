import React from "react";

export default function TaskCard({ task, onDelete, onEdit }) {
  return (
    <div className="border p-4 rounded-lg shadow-sm bg-white flex justify-between items-center hover:shadow-md transition">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
        <p className="text-gray-600">{task.description}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(task)}
          className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
