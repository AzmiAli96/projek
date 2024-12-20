"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
import toast from "react-hot-toast";


type Pesanan = {
  id: number;
  id_user: number;
  id_barang: number;
  tanggal: Date;
  jumlah_beli: number;
  status: string;
  keputusan: string;
  barang: {
    kode_barang: string,
    nama_barang: string,
    harga: number
  }
};

const ITEMS_PER_PAGE = 10;

const Pesanan = () => {
  const [items, setItems] = useState<Pesanan[]>([]);
  const [selectedItem, setSelectedItem] = useState<Pesanan | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // Decode token untuk mendapatkan id_user
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      try {
        const decoded = jwt.decode(token) as { id: number };
        setUserId(decoded.id); // Simpan id_user dari token
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchPesanan = async () => {
      try {
        const response = await axios.get("/api/pemesanan");
        const allPesanan = response.data.data as Pesanan[];

        if (userId) {
          // Filter pesanan hanya untuk id_user saat ini
          const userPesanan = allPesanan.filter((item) => item.id_user === userId);
          setItems(userPesanan);
        }
      } catch (error) {
        console.error("Gagal mengambil data pesanan:", error);
      }
    };

    if (userId) {
      fetchPesanan();
    }
  }, [userId]);

  const totalHarga = (item: Pesanan) => {
    return item.barang.harga * item.jumlah_beli;
  };

  const handleStatusUpdate = (item: Pesanan) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleImageUpload = async () => {
    if (!uploadedImage || !selectedItem) {
      alert("Harap pilih gambar dan pastikan item dipilih.");
      return;
    }

    try {
      console.log(selectedItem.barang);

      const formData = new FormData();
      formData.append("image", uploadedImage);
      formData.append("id", selectedItem.id.toString());

      const response = await axios.post<{ data: string }>("/api/upload/pembelian", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response from backend:", response.data);


      const imagePath = response.data.data;

      // Perbarui item dengan path gambar baru
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id_user === selectedItem.id_user &&
            item.id_barang === selectedItem.id_barang
            ? { ...item, status: imagePath } // Perbarui status dengan path gambar
            : item
        )
      );

      setShowModal(false);
      // alert("Bukti pembayaran berhasil diunggah.");
      toast.success("Success To Upload Image");
    } catch (error: any) {
      // Tangani error yang terjadi selama upload
      console.error("Error uploading image:", error);


      if (axios.isAxiosError(error)) {
        // alert(`Gagal mengunggah gambar: ${error.response?.data?.error || "Coba lagi."}`);
        toast.error(`Error to Uploding image: ${error.response?.data?.error || "Try Again."}`);
      } else {
        // alert("Terjadi kesalahan. Coba lagi.");
        toast.error("Someting wrong. Try again");
      }
    }
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
    <div className="flex flex-row gap-9">
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Pesanan Saya
        </h4>

        <table className="table-fixed w-full border border-stroke bg-white shadow-lg rounded-lg overflow-hidden mb-5">
          <thead className="font-semibold text-black bg-gray-200">
            <tr>
              <td className="w-1/12 p-4 text-center border-b border-stroke">No</td>
              <td className="w-2/12 p-4 text-center border-b border-stroke">Tanggal</td>
              <td className="w-3/12 p-4 text-center border-b border-stroke">Kode Barang</td>
              <td className="w-3/12 p-4 text-center border-b border-stroke">Nama Barang</td>
              <td className="w-3/12 p-4 text-center border-b border-stroke">Jumlah Beli</td>
              <td className="w-2/12 p-4 text-center border-b border-stroke">Harga</td>
              <td className="w-2/12 p-4 text-center border-b border-stroke">Status</td>
              <td className="w-2/12 p-4 text-center border-b border-stroke">Keputusan</td>
              <td className="w-2/12 p-4 text-center border-b border-stroke">Action</td>
            </tr>
          </thead>
          <tbody className="text-black">
            {currentItems.map((item, index) => (
              <tr key={item.id}>
                <td className="p-4 text-center border-b border-stroke">{index + 1}</td>
                <td className="p-4 text-center border-b border-stroke">
                  {new Date(item.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "long" })}
                </td>
                <td className="p-4 text-center border-b border-stroke">{item.barang.kode_barang}</td>
                <td className="p-4 text-center border-b border-stroke">{item.barang.nama_barang}</td>
                <td className="p-4 text-center border-b border-stroke">{item.jumlah_beli}</td>
                <td className="p-4 text-center border-b border-stroke">
                  {totalHarga(item).toLocaleString()}
                </td>
                {/* <td className="p-4 text-center border-b border-stroke">
                  {item.status.startsWith("/uploads/") ? (
                    <img
                      src={item.status}
                      alt="Bukti Pembayaran"
                      className="w-20 h-20 object-cover mx-auto rounded"
                    />
                  ) : (
                    item.status
                  )}
                </td> */}
                <td>
                  <div className={`text-center border-b border-stroke ${item.status.includes("/upload")
                    ? "bg-green-600 text-white font-semibold rounded-full text-sm px-2 py-0.5"
                    : "bg-gray-400 text-white font-semibold rounded-full text-sm px-2 py-0.5"
                    }`}>
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


                <td className="p-4 text-center border-b border-stroke">
                  <button
                    onClick={() => handleStatusUpdate(item)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Unggah Bukti
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

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Unggah Bukti Pembayaran</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setUploadedImage(e.target.files?.[0] || null)}
              className="mb-4"
            />
            <div className="flex gap-4">
              <button
                onClick={handleImageUpload}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Unggah
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pesanan;
