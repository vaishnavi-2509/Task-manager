import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const [form , setForm] = useState({name: "", email: "", password:""});
    const navigate = useNavigate();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        await axios.post("http://localhost:5000/api/auth/register", form);
        navigate("/");
    };

    return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        {["name", "email", "password"].map((f) => (
          <input key={f} className="border p-2 w-full mb-3" placeholder={f} type={f === "password" ? "password" : "text"} onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
        ))}
        <button className="bg-green-600 text-white w-full py-2 rounded">Register</button>
        <p className="text-sm text-center mt-3">Already have an account? <Link to="/" className="text-blue-500">Login</Link></p>
      </form>
    </div>
  );
}