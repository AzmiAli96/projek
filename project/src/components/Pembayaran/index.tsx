"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

type Pesanan = {
  id: number;
  id_user: number;
  id_barang: number;
  tanggal: Date;
  jumlah_beli: number;
  status: string;
  barang: {
    kode_barang: string;
    nama_barang: string;
    harga: number;
  };
  user: {
    name: string;
    email: string;
  };
};

const ITEMS_PER_PAGE = 10;

const PemesananB = () => {
  const [items, setItems] = useState<Pesanan[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const itemData = async () => {
      try {
        const response = await axios.get("/api/pemesanan");
        setItems(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.log("Gagal mengambil data pesanan");
      }
    };
    itemData();
  }, []);

  const totalHarga = (item: Pesanan) => {
    return item.barang.harga * item.jumlah_beli;
  };

  const handleStatusClick = (item: Pesanan) => {
    console.log('Status Clicked:', item.status);
    if (item.status.includes("/upload")) {
      setImageSrc(item.status); // Atur sumber gambar dari item
      setShowModal(true); // Tampilkan modal
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setImageSrc(null);
  };

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
    <div className="flex flex-col gap-9">
      <div className="rounded-sm border border-stroke bg-white px-5 pb-6 pt-6 shadow-default">
        <h4 className="mb-6 text-xl font-semibold text-black">Pesanan Saya</h4>

        <table className="table-auto w-full border border-stroke bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="font-semibold text-black bg-gray-200">
            <tr>
              <td className="p-4 text-center border-b border-stroke">No</td>
              <td className="p-4 text-center border-b border-stroke">Nama</td>
              <td className="p-4 text-center border-b border-stroke">Tanggal</td>
              <td className="p-4 text-center border-b border-stroke">Kode Barang</td>
              <td className="p-4 text-center border-b border-stroke">Nama Barang</td>
              <td className="p-4 text-center border-b border-stroke">Jumlah</td>
              <td className="p-4 text-center border-b border-stroke">Harga</td>
              <td className="p-4 text-center border-b border-stroke">Status</td>
            </tr>
          </thead>
          <tbody className="text-black">
            {currentItems.map((item, index) => (
              <tr key={item.id}>
                <td className="p-4 text-center border-b border-stroke">{index + 1}</td>
                <td className="p-4 text-center border-b border-stroke">
                  {item.user.name}
                </td>
                <td className="p-4 text-center border-b border-stroke">
                  {new Date(item.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "long" })}
                </td>
                <td className="p-4 text-center border-b border-stroke">{item.barang.kode_barang}</td>
                <td className="p-4 text-center border-b border-stroke">{item.barang.nama_barang}</td>
                <td className="p-4 text-center border-b border-stroke">{item.jumlah_beli}</td>
                <td className="p-4 text-center border-b border-stroke">
                  {totalHarga(item).toLocaleString()}
                </td>
                {/* <td>
                  <div
                    className={`text-center cursor-pointer ${item.status.toLowerCase() === "sudah bayar"
                      ? "bg-green-600 text-white rounded-full text-sm px-4 py-1"
                      : "bg-gray-400 text-white rounded-full text-sm px-4 py-1"
                      }`}
                    onClick={() => handleStatusClick(item)}
                  >
                    {item.status.toUpperCase()}
                  </div>
                </td> */}
                <td>
                  <div className={`text-center border-b border-stroke ${item.status.includes("/upload")
                    ? "bg-green-600 text-white font-semibold rounded-full text-sm px-2 py-0.5"
                    : "bg-gray-400 text-white font-semibold rounded-full text-sm px-2 py-0.5"
                    }`}
                    onClick={() => handleStatusClick(item)}>
                    {item.status.includes("/upload") ? "Sudah Bayar" : "Belum Bayar"}
                  </div>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={closeModal}
            >
              ✕
            </button>
            {/* Display Image */}
            {/* {imageSrc ? (
              <img
                src={imageSrc}
                alt="Bukti Pembayaran"
                className="w-40 h-40 object-cover mx-auto rounded"
              />
            ) : (
              <p className="text-center text-gray-700 font-medium">Tidak ada gambar</p>
            )} */}
            {imageSrc ? (
              <div>
                <img
                  src={imageSrc}
                  alt="Preview"
                  className="w-full h-auto object-contain mx-auto"
                />
              </div>
            ) : (
              <p className="text-center text-gray-700 font-medium">Tidak ada gambar</p>
            )}
            {/* Close Button */}
            <button
              className="mt-6 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              onClick={closeModal}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PemesananB;
