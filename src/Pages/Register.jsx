import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from "../features/auth/authSlice";
import { useNavigate } from 'react-router-dom'; // ✅ fix here

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error, message } = useSelector((state) => state.auth);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [number, setNumber] = useState('');
  const [role, setRole] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();

    const formData = {
      username,
      email,
      password,
      number,
      role,
    };

    dispatch(registerUser(formData))
      .unwrap()
      .then((res) => {
        console.log("✅ Registration Successful", res);
        navigate('/chat');
      })
      .catch((err) => {
        console.error("❌ Registration Failed", err);
      });
  };

  return (
    <div className="w-full max-w-xl mx-auto my-10 border p-6 rounded-lg">
      <h1 className="text-3xl font-bold text-center">Register</h1>

      <form onSubmit={handleRegister} className="flex flex-col gap-5 my-5">
        <div>
          <label>Name</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="border p-2 w-full rounded-md" required />
        </div>

        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 w-full rounded-md" required />
        </div>

        <div>
          <label>Phone Number</label>
          <input type="number" value={number} onChange={(e) => setNumber(e.target.value)} className="border p-2 w-full rounded-md" required />
        </div>

        <div>
          <label>User Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="border p-2 w-full rounded-md" required>
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 w-full rounded-md" required />
        </div>

        <button type="submit" className="bg-black text-white py-2 rounded-md">
          {status === 'loading' ? 'Registering...' : 'Register'}
        </button>

        {error && <p className="text-red-500">{error}</p>}
        {message && <p className="text-green-500">{message}</p>}
      </form>
    </div>
  );
};

export default Register;
