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
    kode_barang: string,
    nama_barang: string,
    harga: number
  }
};

const Pesanan = () => {
  const [items, setItems] = useState<Pesanan[]>([]);
  const [selectedItem, setSelectedItem] = useState<Pesanan | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

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

      const response = await axios.post<{ data: string }>("/api/upload", formData, {
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
      alert("Bukti pembayaran berhasil diunggah.");
    } catch (error: any) {
      // Tangani error yang terjadi selama upload
      console.error("Error uploading image:", error);

      if (axios.isAxiosError(error)) {
        alert(`Gagal mengunggah gambar: ${error.response?.data?.error || "Coba lagi."}`);
      } else {
        alert("Terjadi kesalahan. Coba lagi.");
      }
    }
  };


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
              <td className="w-2/12 p-4 text-center border-b border-stroke">Action</td>
            </tr>
          </thead>
          <tbody className="text-black">
            {items.map((item, index) => (
              <tr key={index}>
                <td className="p-4 text-center border-b border-stroke">{index + 1}</td>
                <td className="p-4 text-center border-b border-stroke">
                  {new Date(item.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "long"})}
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
                  <div className={`text-center border-b border-stroke ${item.status.toLowerCase() === "sudah bayar"
                      ? "bg-green-600 text-white font-semibold rounded-full text-sm px-2 py-0.5"
                      : "bg-gray-400 text-white font-semibold rounded-full text-sm px-2 py-0.5"
                    }`}>

                  {item.status.toUpperCase()}
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
