import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function AddEditForm() {
  const [form, setForm] = useState({
    trip_name: '',
    content: '',
    imageUrl: ''
  });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3000/trips/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then(({ data }) => {
        setForm({
          trip_name: data.trip_name,
          content: data.content,
          imageUrl: data.imageUrl
        });
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }, [id]);

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
      if (id) {
        await axios.put(`http://localhost:3000/trips/${id}`, form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        Swal.fire({
          title: "Success!",
          text: "Artikel berhasil diperbarui",
          icon: "success",
        });
      } else {
        await axios.post('http://localhost:3000/trips', form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        Swal.fire({
          title: "Success!",
          text: "Artikel berhasil ditambahkan",
          icon: "success",
        });
      }
      navigate('/');
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Terjadi kesalahan",
        icon: "error",
      });
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-yellow-200 border-4 border-black rounded-lg">
      <h1 className="text-4xl font-black mb-8 bg-white p-4 border-4 border-black rounded inline-block transform -rotate-2">{id ? 'Edit Artikel' : 'Tambah Artikel'}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 border-4 border-black rounded transform hover:-translate-y-1 transition-transform">
          <label className="block text-black text-xl font-bold mb-4" htmlFor="trip_name">
            Nama Trip
          </label>
          <input
            type="text"
            name="trip_name"
            value={form.trip_name}
            onChange={handleChange}
            className="w-full p-3 border-4 border-black rounded font-bold focus:ring-4 focus:ring-yellow-400 focus:outline-none"
            required
          />
        </div>
        <div className="bg-white p-6 border-4 border-black rounded transform hover:-translate-y-1 transition-transform">
          <label className="block text-black text-xl font-bold mb-4" htmlFor="content">
            Konten
          </label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            className="w-full p-3 border-4 border-black rounded font-bold focus:ring-4 focus:ring-yellow-400 focus:outline-none min-h-[150px]"
            required
          />
        </div>
        <div className="bg-white p-6 border-4 border-black rounded transform hover:-translate-y-1 transition-transform">
          <label className="block text-black text-xl font-bold mb-4" htmlFor="imageUrl">
            URL Gambar
          </label>
          <input
            type="text"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full p-3 border-4 border-black rounded font-bold focus:ring-4 focus:ring-yellow-400 focus:outline-none"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-black text-white text-xl font-bold py-3 px-8 border-4 border-black rounded hover:bg-yellow-400 hover:text-black transition-all transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
          >
            {id ? 'Perbarui' : 'Tambah'}
          </button>
        </div>
      </form>
    </div>
  );
}
