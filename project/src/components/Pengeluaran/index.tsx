"use client";

import React, { FormEvent, useEffect, useState } from "react";
import axios from "axios";

type PengeluaranItem = {
  id: number;
  jenis_pengeluaran: string;
  ket: string;
  biaya: number;
  tanggal: string;
};

const ITEMS_PER_PAGE = 10;

const Pengeluaran: React.FC = () => {
  const [jenis_pengeluaran, setJenis_pengeluaran] = useState("");
  const [ket, setKet] = useState("");
  const [biaya, setBiaya] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [items, setItems] = useState<PengeluaranItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // -------------------------- MENAMPILKAN DATA -------------------------------
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("/api/pengeluaran");
        setItems(response.data.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchItems();
  }, []);
  // -------------------------- END MENAMPILKAN DATA -------------------------------

  // -------------------------- INSERT DATA PENGELUARAN -------------------------------
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const newPengeluaran = {
        jenis_pengeluaran,
        ket,
        biaya: parseFloat(biaya), // Konversi biaya ke number
        tanggal,
      };
      const response = await axios.post("/api/pengeluaran", newPengeluaran, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(response.data);

      // Reset form
      setJenis_pengeluaran("");
      setKet("");
      setBiaya("");
      setTanggal("");

      // Tambahkan item baru ke tabel
      setItems((prevItems) => [...prevItems, response.data]);
    } catch (error) {
      console.error("Gagal menagmbil data pengeluaran", error);
    }
  };
  // -------------------------- END INSERT DATA PENGELUARAN -------------------------------

  const fetchData = async () => {
    const response = await axios.get("/api/pengeluaran");
    setItems(response.data.data);
  };

  // -------------------------- DELETE DATA PENGELUARAN -------------------------------

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/pengeluaran/${id}`);
      console.log("Pengeluaran Berhasil dihapus");
      fetchData();
    } catch (error) {
      console.log("Gagal menghapus pengeluran");
    }
  };

  // -------------------------- END DELETE DATA PENGELUARAN -------------------------------

  // ----------------------------- PAGINATION ---------------------------------
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIdex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = items.slice(startIdex, startIdex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }
  // ----------------------------- END PAGINATION ---------------------------------

  return (
    <div className="flex flex-row gap-9">
      {/* Form */}
      <div className="w-1/4 flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default">
          <div className="border-b border-stroke px-6.5 py-4">
            <h3 className="font-medium text-black">Input & Update Data</h3>
          </div>
          <div className="p-6.5">
            <form onSubmit={handleSubmit}>
              {/* Jenis Pengeluaran */}
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Jenis Pengeluaran
                </label>
                <input
                  value={jenis_pengeluaran}
                  onChange={(e) => setJenis_pengeluaran(e.target.value)}
                  type="text"
                  placeholder="Jenis Pengeluaran"
                  className="w-full rounded-lg border px-5 py-3"
                />
              </div>
              {/* Keterangan */}
              <div>
                <label className="mb-2 mt-3 block text-sm font-medium text-black">
                  Keterangan Pengeluaran
                </label>
                <textarea
                  value={ket}
                  onChange={(e) => setKet(e.target.value)}
                  rows={6}
                  placeholder="Keterangan"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
                {/* <input
                  value={ket}
                  onChange={(e) => setKet(e.target.value)}
                  type="text"
                  placeholder="Keterangan"
                  className="w-full rounded-lg border px-5 py-3"
                /> */}
              </div>
              {/* Biaya */}
              <div>
                <label className="mb-2 mt-3 block text-sm font-medium text-black">
                  Biaya
                </label>
                <input
                  value={biaya}
                  onChange={(e) => setBiaya(e.target.value)}
                  type="number"
                  placeholder="Biaya"
                  className="w-full rounded-lg border px-5 py-3"
                />
              </div>
              {/* Tanggal */}
              <div>
                <label className="mb-2 mt-3 block text-sm font-medium text-black">
                  Tanggal Pengeluaran
                </label>
                <input
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  type="date"
                  className="w-full rounded-lg border px-5 py-3"
                />
              </div>
              {/* Submit */}
              <div className="flex justify-end mt-5">
                <button
                  type="submit"
                  className="bg-blue-500 px-4 py-2 text-white rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-3/4">
        <div className="rounded-sm border border-stroke bg-white p-5 shadow-default">
          <h4 className="mb-6 text-xl font-semibold text-black">Pengeluaran Harian</h4>
          <table className="w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-4 border">No</th>
                <th className="p-4 border">Tanggal</th>
                <th className="p-4 border">Jenis Pengeluaran</th>
                <th className="p-4 border">Keterangan</th>
                <th className="p-4 border">Biaya</th>
                <th className="p-4 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item.id}>
                  <td className="p-4 border">{index + 1}</td>
                  <td className="p-4 border">
                    {new Date(item.tanggal).toLocaleDateString("id-ID", { month: "long", day: "numeric" })}
                  </td>

                  <td className="p-4 border">{item.jenis_pengeluaran}</td>
                  <td className="p-4 border">{item.ket}</td>
                  <td className="p-4 border">{item.biaya}</td>
                  <td className="p-4 border">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 mx-auto"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 mx-1 border rounded ${currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white text-gray-800"
                }`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 mx-1 border rounded ${currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800"
                  }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 mx-1 border rounded ${currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white text-gray-800"
                }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pengeluaran;
