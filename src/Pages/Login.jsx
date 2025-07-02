import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({ email: '', password: '' });
  const { status, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form))
      .unwrap()
      .then(() => {
        navigate('/chat');
      })
      .catch((err) => {
        console.log("Login failed:", err);
      });
  };

  return (
    <div className="w-full max-w-md mx-auto my-10 border p-6 rounded-md shadow-md">
      <h1 className="text-3xl font-bold text-center">Login</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 my-5">
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 rounded-md outline-none"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={form.password}
            onChange={handleChange}
            className="border p-2 rounded-md outline-none"
            required
          />
        </div>

        {status === 'loading' ? (
          <button disabled className="bg-gray-400 text-white py-2 rounded-md">Logging in...</button>
        ) : (
          <button type="submit" className="bg-black text-white py-2 rounded-md">Login</button>
        )}

        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
