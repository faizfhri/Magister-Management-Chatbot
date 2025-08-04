import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import '../App.css';


function FaqPage() {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('Umum');
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const kategoriOptions = [
    "Tentang Program",
    "Pendaftaran",
    "Perkuliahan",
    "Kurikulum & Tugas Akhir",
    "Biaya",
    "Fasilitas & Lokasi",
    "Alumni & Karier",
    "Kelas Reguler",
    "Kelas Eksekutif",
    "Kelas Project-Based",
    "Umum"
  ];

  const fetchFaqs = async () => {
    try {
      const res = await axios.get('https://zpwasiqrcqvhdvyyskdv.supabase.co/functions/v1/crud/faqs');
      setFaqs(res.data);
    } catch (err) {
      console.error("❌ Error fetching FAQs:", err.response?.data || err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { question, answer, category };
      if (editId) {
        await axios.put(`https://zpwasiqrcqvhdvyyskdv.supabase.co/functions/v1/crud/faqs/${editId}`, payload);
        toast.success('FAQ berhasil diupdate!');
      } else {
        await axios.post('https://zpwasiqrcqvhdvyyskdv.supabase.co/functions/v1/crud/faqs', payload);
        toast.success('FAQ berhasil ditambahkan!');
      }
      setQuestion('');
      setAnswer('');
      setCategory('Umum');
      setEditId(null);
      await fetchFaqs();
    } catch (err) {
      console.error("❌ Error submit:", err);
      toast.error('Gagal menyimpan FAQ.');
    }
  };

  const handleEdit = (faq) => {
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category || 'Umum');
    setEditId(faq.id);
  };

  const handleCancelEdit = () => {
    setQuestion('');
    setAnswer('');
    setCategory('Umum');
    setEditId(null);
  };

  const handleDelete = async (id) => {
    const confirmed = confirm("Apakah kamu yakin ingin menghapus FAQ ini?");
    if (!confirmed) return;
    try {
      await axios.delete(`https://zpwasiqrcqvhdvyyskdv.supabase.co/functions/v1/crud/faqs/${id}`);
      toast.success('FAQ berhasil dihapus!');
      await fetchFaqs();
    } catch (err) {
      console.error("❌ Error deleting FAQ:", err);
      toast.error('Gagal menghapus FAQ.');
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'Semua' || faq.category === selectedCategory)
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6 text-center">FAQ Dashboard</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-6 mb-8 max-w-xl mx-auto">
        <div className="mb-4">
          <label className="block text-gray-700">Pertanyaan</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-4 py-2 border rounded mt-1"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Jawaban</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full px-4 py-2 border rounded mt-1"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Kategori</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border rounded mt-1"
          >
            {kategoriOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editId ? 'Update' : 'Tambah'}
          </button>
          {editId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Batal Edit
            </button>
          )}
        </div>
      </form>

      <div className="max-w-4xl mx-auto mb-4 flex flex-col md:flex-row gap-2">
        <input
          type="text"
          placeholder="Cari pertanyaan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-2/3 px-4 py-2 border rounded"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded"
        >
          <option value="Semua">Semua Kategori</option>
          {kategoriOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="max-w-4xl mx-auto text-sm text-gray-600 mb-2">
        Menampilkan {filteredFaqs.length} dari {faqs.length} total FAQ
      </div>

      <div className="overflow-x-auto max-w-4xl mx-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-200 text-left">
                <th className="p-4 border">ID</th>
              <th className="p-4 border">Pertanyaan</th>
              <th className="p-4 border">Jawaban</th>
              <th className="p-4 border">Kategori</th>
              <th className="p-4 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredFaqs.map((faq) => (
              <tr key={faq.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 border-t border-l border-r text-xs text-gray-500">{faq.id}</td>
                <td className="p-4 border-t border-l border-r whitespace-pre-line">{faq.question}</td>
                <td className="p-4 border-t border-r whitespace-pre-line">{faq.answer}</td>
                <td className="p-4 border-t border-r">{faq.category || "Umum"}</td>
                <td className="p-4 border-t border-r space-x-2">
                  <button
                    onClick={() => handleEdit(faq)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {filteredFaqs.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  Tidak ada pertanyaan ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FaqPage;