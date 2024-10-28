import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'user',
    firstName: '',
    lastName: '',
    dateOfBirth: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/register', form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      Swal.fire({
        title: "Success!",
        text: "Registrasi berhasil",
        icon: "success",
      });
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Swal.fire({
          title: "Unauthorized!",
          text: "Anda tidak memiliki izin untuk melakukan registrasi.",
          icon: "error",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: error.message, 
          icon: "error",
        });
      }
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-purple-500 border-4 border-black rounded-lg shadow-lg">
      <h1 className="text-4xl font-black mb-8 text-center text-white">TamBaHkEun</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 border-4 border-black rounded shadow-md">
          <label className="block text-black text-xl font-bold mb-4" htmlFor="firstName">
            Nama Pertama dan Nama Akhiran
          </label>
          <div className="flex space-x-4">
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Nama Pertama"
              className="w-1/2 p-3 border-4 border-black rounded font-bold focus:ring-4 focus:ring-purple-400 focus:outline-none"
              required
            />
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Nama Akhiran"
              className="w-1/2 p-3 border-4 border-black rounded font-bold focus:ring-4 focus:ring-purple-400 focus:outline-none"
              required
            />
          </div>
        </div>
        <div className="bg-white p-6 border-4 border-black rounded shadow-md">
          <label className="block text-black text-xl font-bold mb-4" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full p-3 border-4 border-black rounded font-bold focus:ring-4 focus:ring-purple-400 focus:outline-none"
            required
          />
        </div>
        <div className="bg-white p-6 border-4 border-black rounded shadow-md">
          <label className="block text-black text-xl font-bold mb-4" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full p-3 border-4 border-black rounded font-bold focus:ring-4 focus:ring-purple-400 focus:outline-none"
            required
          />
        </div>
        <div className="bg-white p-6 border-4 border-black rounded shadow-md">
          <label className="block text-black text-xl font-bold mb-4" htmlFor="dateOfBirth">
            Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
            className="w-full p-3 border-4 border-black rounded font-bold focus:ring-4 focus:ring-purple-400 focus:outline-none"
            required
          />
        </div>
        <div className="bg-white p-6 border-4 border-black rounded shadow-md">
          <label className="block text-black text-xl font-bold mb-4" htmlFor="role">
            Role
          </label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-3 border-4 border-black rounded font-bold focus:ring-4 focus:ring-purple-400 focus:outline-none"
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-purple-700 text-white text-xl font-bold py-3 px-8 border-4 border-black rounded-full hover:bg-purple-600 transition-all transform hover:-translate-y-1 hover:shadow-lg"
          >
            Tambahkan!!!
          </button>
        </div>
      </form>
    </div>
  );
}
