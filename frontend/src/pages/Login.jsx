import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        const res = await axios.post("http://localhost:5000/api/auth/login",{email, password});
        localStorage.setItem("token:", res.data.token);
        navigate("/dashboard");
    };

return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <input className="border p-2 w-full mb-3" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input className="border p-2 w-full mb-3" placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
        <button className="bg-blue-600 text-white w-full py-2 rounded">Login</button>
        <p className="text-sm text-center mt-3">No account? <Link to="/register" className="text-blue-500">Register</Link></p>
      </form>
    </div>
);
}