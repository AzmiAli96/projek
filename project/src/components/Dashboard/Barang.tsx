"use client";
import axios from "axios";
import Link from "next/link";
import React, { FormEvent, useEffect, useState } from "react";

type barang = {
  kode_barang: string
  nama_barang: string
  ket: string
  harga: number
  jumlah: number
  image: string
}

const Barang: React.FC = () => {
  const [kode_barang, setKode_Barang] = useState("");
  const [nama_barang, setNama_Barang] = useState("");
  const [ket, setKet] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [harga, setHarga] = useState("");
  const [image, setImage] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const itemData = async () => {
      const response = await axios.get("/api/barang");
      setItems(response.data.data)
    }

    itemData();
  }, []);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const item = await axios.post("/api/barang", {
        kode_barang: kode_barang,
        nama_barang: nama_barang,
        ket: ket,
        jumlah: jumlah,
        harga: harga,
        image: image
      }, {
        headers: { "Content-Type": "application/json" }
      });

      console.log(item);
      setKode_Barang('') //menghilangkan saat input
      setNama_Barang('')
      setKet('')
      setHarga('')
      setJumlah('')
      setImage('')
    } catch (error) {
      console.log("gagal simpan data barang");
    }
  }
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
              <form onSubmit={handleSubmit}>
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
                  <input
                    value={ket}
                    onChange={(e) => { setKet(e.target.value) }}
                    type="text"
                    placeholder="Default Input"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
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
                  <input
                    value={image}
                    onChange={(e) => { setImage(e.target.value) }}
                    type="text"
                    placeholder="Default Input"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="flex justify-end mt-5">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md bg-meta-3 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                  >
                    Button
                  </button>
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
                {items.map((item: barang, index) => (
                  <tr key={index} className="hover:bg-gray-100 transition-colors">
                    <td className="p-4 text-center border-b border-stroke">{index + 1}</td>
                    <td className="p-4 text-center border-b border-stroke">{item.kode_barang}</td>
                    <td className="p-4 text-center border-b border-stroke">{item.nama_barang}</td>
                    <td className="p-4 text-center border-b border-stroke">{item.ket}</td>
                    <td className="p-4 text-center border-b border-stroke">{item.harga}</td>
                    <td className="p-4 text-center border-b border-stroke">{item.jumlah}</td>
                    <td className="p-4 text-center border-b border-stroke">
                      <button className="text-red-600 hover:text-red-800 transition duration-150">
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


          </div>
        </div>
      </div>
    </>
  );
};

export default Barang;
