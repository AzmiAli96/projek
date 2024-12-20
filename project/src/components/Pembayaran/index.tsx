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
  keputusan: string;
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
  const [selectedItem, setSelectedItem] = useState<Pesanan | null>(null); // Item yang dipilih
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
    console.log("Status Clicked:", item.status);
    if (item.status.includes("/upload")) {
      setImageSrc(item.status);
      setSelectedItem(item); // Set item aktif di modal
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setImageSrc(null);
    setSelectedItem(null);
  };

  const handleKeputusan = async (keputusan: string) => {
    if (!selectedItem) return;

    try {
      await axios.patch(`/api/pemesanan/${selectedItem.id}`, { keputusan }); // Update keputusan
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === selectedItem.id ? { ...item, keputusan } : item
        )
      );
      closeModal(); // Tutup modal setelah update
    } catch (error) {
      console.error("Gagal memperbarui keputusan", error);
    }
  };

  // ----------------------------- PAGINATION ---------------------------------
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
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
              <td className="p-4 text-center border-b border-stroke">Keputusan</td>
            </tr>
          </thead>
          <tbody className="text-black">
            {currentItems.map((item, index) => (
              <tr key={item.id}>
                <td className="p-4 text-center border-b border-stroke">{index + 1}</td>
                <td className="p-4 text-center border-b border-stroke">{item.user.name}</td>
                <td className="p-4 text-center border-b border-stroke">
                  {new Date(item.tanggal).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                  })}
                </td>
                <td className="p-4 text-center border-b border-stroke">{item.barang.kode_barang}</td>
                <td className="p-4 text-center border-b border-stroke">{item.barang.nama_barang}</td>
                <td className="p-4 text-center border-b border-stroke">{item.jumlah_beli}</td>
                <td className="p-4 text-center border-b border-stroke">
                  {totalHarga(item).toLocaleString()}
                </td>
                <td>
                  <div
                    className={`text-center cursor-pointer ${item.status.includes("/upload")
                      ? "bg-green-600"
                      : "bg-gray-400"
                      } text-white font-semibold rounded-full text-sm px-2 py-0.5`}
                    onClick={() => handleStatusClick(item)}
                  >
                    {item.status.includes("/upload") ? "Sudah Bayar" : "Belum Bayar"}
                  </div>
                </td>
                <td className="text-center border-b border-stroke">
                  <div
                    className={`text-center cursor-pointer text-white font-semibold rounded-full text-sm px-2 py-0.5
      ${item.keputusan === "dalam proses"
                        ? "bg-gray-400"
                        : item.keputusan === "Tolak"
                          ? "bg-red-500"
                          : item.keputusan === "Terima"
                            ? "bg-green-600"
                            : "bg-gray-200" // Default jika keputusan tidak sesuai
                      }
    `}
                  >
                    {item.keputusan || "Belum Ada Keputusan"}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={closeModal}
            >
              ✕
            </button>
            {imageSrc && (
              <img
                src={imageSrc}
                alt="Preview"
                className="w-full h-auto object-contain mx-auto mb-4"
              />
            )}
            <div className="flex gap-2">
            <button
              className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              onClick={() => handleKeputusan("Tolak")}
            >
              Tolak
            </button>
            <button
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              onClick={() => handleKeputusan("Terima")}
            >
              Terima
            </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PemesananB;
