import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

function UserPage() {
  const [users, setUsers] = useState([]);
  const [nama, setNama] = useState('');
  const [noTelp, setNoTelp] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://zpwasiqrcqvhdvyyskdv.supabase.co/functions/v1/userdata');
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Error fetching users:", err.response?.data || err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { nama, no_telp: noTelp };
    try {
      if (editId) {
        await axios.put(`https://zpwasiqrcqvhdvyyskdv.supabase.co/functions/v1/userdata/${editId}`, payload);
        toast.success('User berhasil diupdate!');
      } else {
        await axios.post('https://zpwasiqrcqvhdvyyskdv.supabase.co/functions/v1/userdata', payload);
        toast.success('User berhasil ditambahkan!');
      }
      setNama('');
      setNoTelp('');
      setEditId(null);
      fetchUsers();
    } catch (err) {
      toast.error('Gagal menyimpan user.');
    }
  };

  const handleEdit = (user) => {
    setNama(user.nama);
    setNoTelp(user.no_telp);
    setEditId(user.no_tiket);
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin hapus user ini?')) return;
    try {
      await axios.delete(`https://zpwasiqrcqvhdvyyskdv.supabase.co/functions/v1/userdata/${id}`);
      toast.success('User berhasil dihapus!');
      fetchUsers();
    } catch {
      toast.error('Gagal menghapus user.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6 text-center">Data User</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-6 mb-8 max-w-xl mx-auto">
        <div className="mb-4">
          <label className="block text-gray-700">Nama</label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">No. Telp</label>
          <input
            type="text"
            value={noTelp}
            onChange={(e) => setNoTelp(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded mt-1"
          />
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          {editId ? "Update" : "Tambah"}
        </button>
      </form>

      <div className="max-w-3xl mx-auto">
        <table className="w-full bg-white border">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-4 border">No Tiket</th>
              <th className="p-4 border">Nama</th>
              <th className="p-4 border">No. Telp</th>
              <th className="p-4 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.no_tiket}>
                <td className="p-4 border">{u.no_tiket}</td>
                <td className="p-4 border">{u.nama}</td>
                <td className="p-4 border">{u.no_telp}</td>
                <td className="p-4 border space-x-2">
                  <button onClick={() => handleEdit(u)} className="bg-yellow-500 px-2 py-1 text-white rounded">Edit</button>
                  <button onClick={() => handleDelete(u.no_tiket)} className="bg-red-500 px-2 py-1 text-white rounded">Hapus</button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">Belum ada user.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserPage;
