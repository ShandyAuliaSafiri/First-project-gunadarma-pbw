import React from 'react';
import { Link } from 'react-router-dom';

export default function Table({ post, onDelete }) {
  console.log(post, "<<< data dari table component");
  
  return (
    <table className="min-w-full border-4 border-black bg-yellow-200">
      <thead className="bg-white border-b-4 border-black">
        <tr className="text-center">
          <th
            scope="col"
            className="px-6 py-4 text-lg font-bold text-black uppercase"
          >
            Title
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-lg font-bold text-black uppercase"
          >
            Content
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-lg font-bold text-black uppercase"
          >
            Negara
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-lg font-bold text-black uppercase"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {post && post.length > 0 ? (
          post.map((item) => (
            <tr
              key={item.id}
              className="border-b-4 border-black hover:bg-yellow-100 transition-colors text-center"
            >
              <td className="px-6 py-4 text-base font-bold text-black">
                <Link
                  to={`/add-edit/${item.id}`}
                  className="hover:text-blue-600 hover:underline cursor-pointer"
                >
                  {item.trip_name}
                </Link>
              </td>
              <td className="px-6 py-4 text-base text-black">{item.content}</td>
              <td className="px-6 py-4 text-base text-black">{item.negara}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onDelete(item.id)}
                  className="bg-black text-white font-bold py-2 px-4 rounded border-4 border-black hover:bg-red-500 hover:text-black transition-all transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
              Tidak ada data yang tersedia
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
