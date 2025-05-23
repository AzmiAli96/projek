"use client";
import axios from "axios";
import Link from "next/link";
import React, { FormEvent, useEffect, useState } from "react";
// import { withUt } from "uploadthing/tw";
import { getUserInfo } from "@/utils/auth";
import toast from "react-hot-toast";


type barang = {
  id: number
  kode_barang: string
  nama_barang: string
  ket: string
  harga: number
  jumlah: number
  image: string
}

const ITEMS_PER_PAGE = 10;

const Barang: React.FC = () => {
  const [kode_barang, setKode_Barang] = useState("");
  const [nama_barang, setNama_Barang] = useState("");
  const [ket, setKet] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [harga, setHarga] = useState("");
  const [image, setImage] = useState("");
  const [items, setItems] = useState<barang[]>([]);
  const [selectedItem, setSelectedItem] = useState<barang | null>(null);
  const [editId, setEditId] = useState<number | null>(null); //
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredBarang, setFilteredBarang] = useState<barang[]>([]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const itemData = async () => {
      const response = await axios.get("/api/barang");
      setItems(response.data.data)
    }

    itemData();
  }, []);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let uploadedImageUrl = "";

      // Upload Image jika ada
      if (uploadedImage) {
        const formData = new FormData();
        formData.append("image", uploadedImage);


        const uploadResponse = await axios.post<{ data: string }>("/api/upload/barang", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        uploadedImageUrl = uploadResponse.data.data;
        console.log("Uploaded Image URL:", uploadedImageUrl);
      }

      // Validasi jika URL gambar tidak ditemukan
      if (!uploadedImageUrl) {
        toast.error("Image upload failed. Please try again.");
        return;
      }

      // Kirim data barang ke backend
      const response = await axios.post(
        "/api/barang",
        {
          kode_barang,
          nama_barang,
          ket,
          jumlah: parseInt(jumlah, 10),
          harga: parseFloat(harga),
          image: uploadedImageUrl,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success("Success to Create Data");
      console.log("Response:", response.data);

      // Reset form
      resetForm();
      fetchData(); // Ambil data terbaru
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data);
        toast.error(`Failed to Create Data: ${error.response?.data?.message || error.message}`);
      } else {
        console.error("Unexpected Error:", error);
        toast.error(`Unexpected Error: ${error}`);
      }
    }
  };


  // ---------------UPDATE ATAU EDIT----------------------------

  // Fungsi untuk mengatur ulang form (DITAMBAHKAN)
  const resetForm = () => {
    setKode_Barang("");
    setNama_Barang("");
    setKet("");
    setHarga("");
    setJumlah("");
    setImage("");
    setEditId(null); // Reset edit ID setelah form di-reset
  };

  // Fungsi untuk mengedit barang (DITAMBAHKAN)
  const handleEdit = (item: barang, id: number) => {
    setKode_Barang(item.kode_barang);
    setNama_Barang(item.nama_barang);
    setKet(item.ket);
    setJumlah(String(item.jumlah));
    setHarga(String(item.harga));
    setImage(item.image);
    setEditId(id); // Simpan ID barang yang sedang diedit
  };

  // Fungsi untuk mengirim update data (DITAMBAHKAN)
  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editId === null) {
      console.log("No edit ID found");
      return; // Jika tidak ada edit ID, hentikan fungsi
    }

    console.log("Updating item with ID:", editId);
    console.log("Data to update:", {
      kode_barang: kode_barang,
      nama_barang: nama_barang,
      ket: ket,
      jumlah: jumlah,
      harga: harga,
      image: image
    });

    try {

      let uploadedImageUrl = image; // Default gunakan gambar lama

      // Upload image jika ada gambar baru yang dipilih
      if (uploadedImage) {
        const formData = new FormData();
        formData.append("image", uploadedImage);

        const uploadResponse = await axios.post<{ data: string }>("/api/upload/barang", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        uploadedImageUrl = uploadResponse.data.data; // URL gambar yang diupload
      }

      const item = await axios.put(
        `/api/barang/${editId}`, // Endpoint untuk update data berdasarkan ID (EDITED)
        {
          kode_barang,
          nama_barang,
          ket,
          jumlah: parseInt(jumlah),
          harga: parseFloat(harga),
          image: uploadedImageUrl,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("Success to Update Data")

      console.log(item);
      resetForm(); // Mengatur ulang form setelah update (EDITED)
      fetchData(); // Ambil data baru setelah update (EDITED)
    } catch (error) {
      toast.error("Error to Update Data")
      console.log("Gagal update data barang", error);
    }
  };

  // Fungsi untuk mengambil data terbaru setelah operasi insert/update (DITAMBAHKAN)
  const fetchData = async () => {
    const response = await axios.get("/api/barang");
    setItems(response.data.data);
  };

  // ---------------END UPDATE ATAU EDIT---------------

  // ----------------DELETE DATA--------------------------
  // Fungsi untuk menghapus barang berdasarkan ID
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/barang/${id}`);
      console.log("Barang berhasil dihapus");
      fetchData(); // Refresh data setelah delete
      toast.success("Success to Delete Data")
    } catch (error) {
      toast.error("Error to Delete Data")
      console.log("Gagal menghapus barang");
    }
  };


  const closeModal = () => {
    setShowModal(false);
    setSelectedId(null);
  };

  const confirmDelete = () => {
    if (selectedId !== null) {
      handleDelete(selectedId); // Proses penghapusan
      closeModal(); // Tutup modal setelah konfirmasi
    }
  };

  console.log(getUserInfo());

  // -----------------------END DELETE--------------------------

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
    <>
      <div className="flex flex-row gap-9">
        {/* <!-- Bagian Input Data --> */}
        <div className="w-1/4 flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Input & Update Data
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <form onSubmit={editId ? handleUpdate : handleSubmit}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                    Kode Barang
                  </label>
                  <input
                    value={kode_barang}
                    onChange={(e) => { setKode_Barang(e.target.value) }}
                    type="text"
                    placeholder="Default Input"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-2 mt-3 block text-sm font-medium text-black dark:text-white">
                    Nama Barang
                  </label>
                  <input
                    value={nama_barang}
                    onChange={(e) => { setNama_Barang(e.target.value) }}
                    type="text"
                    placeholder="Default Input"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-2 mt-3 block text-sm font-medium text-black dark:text-white">
                    Keterangan
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
                    onChange={(e) => { setKet(e.target.value) }}
                    type="text"
                    placeholder="Default Input"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  /> */}
                </div>
                <div>
                  <label className="mb-2 mt-3 block text-sm font-medium text-black dark:text-white">
                    Harga
                  </label>
                  <input
                    value={harga}
                    onChange={(e) => { setHarga(e.target.value) }}
                    type="number"
                    placeholder="Default Input"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-2 mt-3 block text-sm font-medium text-black dark:text-white">
                    Jumlah
                  </label>
                  <input
                    value={jumlah}
                    onChange={(e) => { setJumlah(e.target.value) }}
                    type="number"
                    placeholder="Default Input"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-2 mt-3 block text-sm font-medium text-black dark:text-white">
                    Images
                  </label>
                  {/* <UploadButton 
                  endpoint={'imageUploader'} onClientUploadComplete={(res) => {
                    console.log("Files: ", res);
                    alert("Upload Completed");
                  }}
                    onUploadError={(error: Error) => {
                      alert(`ERROR! ${error.message}`);
                    }} 
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition"/> */}
                  <input
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadedImage(e.target.files[0]); // Simpan file ke state
                      }
                    }}
                    type="file"
                    placeholder="Default Input"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="flex justify-end mt-5">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md bg-meta-3 px-8 py-4 font-medium text-white hover:bg-opacity-90 mr-3"
                  >
                    {editId ? "Update" : "Tambah"} {/* Kondisi label tombol */}
                    Button
                  </button>
                  {editId && (
                    <button
                      type="button"
                      onClick={resetForm} /* Tombol batal untuk reset form */
                      className="inline-flex items-center justify-center rounded-md bg-gray-400 px-8 py-4 font-medium text-white hover:bg-opacity-90"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* <!-- Bagian Hasil --> */}
        <div className="w-3/4 flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
              Informasi Barang
            </h4>
            <div className='mb-4 w-full sm:w-40'>
              <input
                type="text"
                placeholder="Cari kode barang atau nama barang"
                className="w-full border border-gray-300 rounded-md p-2"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <table className="table-fixed w-full border border-stroke bg-white shadow-lg rounded-lg overflow-hidden mb-5">
              <thead className="font-semibold text-black bg-gray-200">
                <tr>
                  <td className="w-1/12 p-4 text-center border-b border-stroke">ID</td>
                  <td className="w-2/12 p-4 text-center border-b border-stroke">Kode Barang</td>
                  <td className="w-3/12 p-4 text-center border-b border-stroke">Nama Barang</td>
                  <td className="w-3/12 p-4 text-center border-b border-stroke">Keterangan</td>
                  <td className="w-2/12 p-4 text-center border-b border-stroke">Harga</td>
                  <td className="w-2/12 p-4 text-center border-b border-stroke">Jumlah</td>
                  <td className="w-2/12 p-4 text-center border-b border-stroke">Action</td>
                </tr>
              </thead>
              <tbody className="text-black">
                {currentItems.map((item: barang, index) => (
                  <tr key={index} className="hover:bg-gray-100 transition-colors">
                    <td className="p-4 text-center border-b border-stroke">{index + 1}</td>
                    <td className="p-4 text-center border-b border-stroke">{item.kode_barang}</td>
                    <td className="p-4 text-center border-b border-stroke">{item.nama_barang}</td>
                    <td className="p-4 text-center border-b border-stroke overflow-hidden whitespace-nowrap text-ellipsis">{item.ket}</td>
                    <td className="p-4 text-center border-b border-stroke">{item.harga}</td>
                    <td className="p-4 text-center border-b border-stroke">{item.jumlah}</td>
                    <td className="p-4 text-center border-b border-stroke">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 transition duration-150">
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
                      <button onClick={() => handleEdit(item, item.id)}
                        className="ml-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="size-6 text-blue-600 hover:text-blue-800 transition duration-150">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>

                      </button>
                      {/* <button
                        onClick={() => handleEdit(item, item.id)}
                        className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
                      >
                        Edit
                      </button> */}
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
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="relative bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
                <h3 className="text-xl font-semibold text-center">Are you sure you want to delete?</h3>
                <div className="flex justify-between mt-4">
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                    onClick={confirmDelete}
                  >
                    Yes
                  </button>
                  <button
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                    onClick={closeModal}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Barang;
