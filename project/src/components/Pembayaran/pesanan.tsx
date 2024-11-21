"use client";

import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import React, { FormEvent, useEffect, useState } from "react";
import axios from "axios";

type barang = {
  kode_barang: string;
  nama_barang: string;
  harga: number;
}

type pesanan = {
  id_user: number
  id_barang: barang
  tanggal: Date
  jumlah_beli: number
  status: string
}

const Pesanan = () => {
  const [items, setItems] = useState<pesanan[]>([]);

  useEffect(() => {
    const itemData = async () => {
      try {
        const response = await axios.get("api/pemesanan");
        setItems(response.data.data);
      } catch (error) {
        console.log("gagal mengambil data pesanan")
      }
    };
    itemData();
  }, []);

  const totalharaga = (item: pesanan) => {
    return item.id_barang.harga * item.jumlah_beli;
  }


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
              <td className="w-3/12 p-4 text-center border-b border-stroke">kode barang</td>
              <td className="w-3/12 p-4 text-center border-b border-stroke">Nama Barang</td>
              <td className="w-3/12 p-4 text-center border-b border-stroke">jumlah beli</td>
              <td className="w-2/12 p-4 text-center border-b border-stroke">Harga</td>
              <td className="w-2/12 p-4 text-center border-b border-stroke">status</td>
              <td className="w-2/12 p-4 text-center border-b border-stroke">Action</td>
            </tr>
          </thead>
          <tbody className="text-black">
            {items.map((item: pesanan, index)=> (
            <tr key={index}>
              <td className="p-4 text-center border-b border-stroke">{index + 1}</td>
              <td className="p-4 text-center border-b border-stroke">{new Date(item.tanggal).toLocaleDateString()}</td>
              <td className="p-4 text-center border-b border-stroke">{item.id_barang.kode_barang}</td>
              <td className="p-4 text-center border-b border-stroke">{item.id_barang.nama_barang}</td>
              <td className="p-4 text-center border-b border-stroke">{item.jumlah_beli}</td>
              <td className="p-4 text-center border-b border-stroke">{totalharaga(item).toLocaleString()}</td>
              <td className="p-4 text-center border-b border-stroke">{item.status}</td>
              <td className="p-4 text-center border-b border-stroke">
                
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div >
  );
};

export default Pesanan;
