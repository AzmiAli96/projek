"use client";
import Link from "next/link";
import axios from "axios";
import React, { FormEvent, useEffect, useState } from "react";

type Barang = {
  id: number;
  kode_barang: string;
  nama_barang: string;
  ket: string;
  harga: number;
  jumlah: number;
  image: string;
};

const ITEMS_PER_PAGE = 16;

const ViewBarang: React.FC = () => {
  const [items, setItems] = useState<Barang[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredBarang, setFilteredBarang] = useState<Barang[]>([]);

  useEffect(() => {
    const itemData = async () => {
      try {
        const response = await axios.get("/api/barang");
        setItems(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil data barang");
      }
    };

    itemData();
  }, []);

  // ---------------------- SEARCH ---------------------------------
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Filter barang berdasarkan kode_barang atau nama_barang
    const filtered = items.filter(
      (item) =>
        item.kode_barang.toLowerCase().includes(value.toLowerCase()) ||
        item.nama_barang.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredBarang(filtered);
  };
  const barangToDisplay = searchTerm ? filteredBarang : items;
  // ---------------------- END SEARCH ---------------------------------

  // ----------------------------- PAGINATION ---------------------------------
  const totalPages = Math.ceil(barangToDisplay.length / ITEMS_PER_PAGE);
  const startIdex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = barangToDisplay.slice(startIdex, startIdex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }
  // ----------------------------- END PAGINATION ---------------------------------

  return (
    <div>
      <div className="flex justify-end items-center space-x-4 mb-4">
        <label className="font-bold text-color-black ">Cari Barang : 
          <input
            type="text"
            placeholder="Cari Nama Barang atau Kode Barang"
            className="border border-gray-300 rounded-md p-2 w-64"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </label>
      </div>
      {/* Bagian Hasil */}
      <div className="flex flex-wrap">
        {currentItems.map((item) => (
          <div key={item.id} className="w-full md:w-1/4 p-4">
            <Link href={`/barang/${item.id}`}>
              <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                <img
                  src={item.image}
                  alt={item.nama_barang}
                  className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h5 className="text-xl font-semibold text-gray-800">{item.nama_barang}</h5>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-gray-900 font-bold">Rp{item.harga}</span>
                    <span className="text-gray-700">{item.jumlah} pcs</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-sm text-gray-600">Kode Barang: {item.kode_barang}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
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
  );
};

export default ViewBarang;
