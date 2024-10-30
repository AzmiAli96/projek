"use client";
import axios from "axios";
import Link from "next/link";
import React, { FormEvent, useEffect, useState } from "react";

type barang ={
  kode_barang: string
  nama_barang :string
  ket :string
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

  useEffect(()  => {
    const itemData = async()=>{
      const response = await axios.get("/api/barang");
      setItems(response.data.data)
    }

    itemData();
  },[]);
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
      setKode_Barang('')
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
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
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
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
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
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
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
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
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
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
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
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
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
                <div className="flex justify-end">
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
              Barang
            </h4>

            <div className="flex flex-col">
              <div className="grid grid-cols-7 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-7 gap-4">
                <div className="p-2.5 text-center xl:p-5">
                  <p className="text-sm font-medium uppercase xsm:text-black dark:text-white">
                    ID
                  </p>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-black dark:text-white">
                    Kode Barang
                  </h5>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-black dark:text-white">
                    Nama Barang
                  </h5>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-black dark:text-white">
                    Keterangan
                  </h5>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-black dark:text-white">
                    Harga
                  </h5>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-black dark:text-white">
                    Jumlah
                  </h5>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-black dark:text-white">
                    Images
                  </h5>
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <td>ID</td>
                    <td>ID</td>
                    <td>ID</td>
                    <td>ID</td>
                    <td>ID</td>
                    <td>ID</td>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: barang)=>(
                    <tr>
                      <td>{item.image}</td>
                    </tr>
                  ))}
                  <tr>

                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Barang;
