import React from "react";
import Table from "../component/Table";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../component/Navbar";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function Home() {
  const [post, setPost] = useState([]);
  const navigate = useNavigate()

  const CmsHome = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/trips", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      console.log(data, "<<< data dari home");
      setPost(data);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
      }
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/trips/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      CmsHome()
      Swal.fire({
        title: "Success!",
        text: "Data berhasil dihapus",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Gagal menghapus data",
        icon: "error",
      });
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      navigate("/login");
      return;
    }
    CmsHome();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar logout={handleLogout} />
      <div className="p-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mx-auto max-w-7xl">
          <div className="flex justify-end mb-4">
            <Link
              to="/add-edit"
              className="bg-black text-white px-4 py-2 rounded-full border-4 border-black hover:bg-yellow-400 hover:text-black transition-all transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
            >
              <span className="text-2xl font-bold">+</span>
            </Link>
          </div>
          {post && post.length > 0 ? (
            <Table post={post} onDelete={deletePost} />
          ) : (
            <p className="text-center text-gray-500">Tidak ada data yang tersedia</p>
          )}
        </div>
      </div>
    </div>
  );
}
