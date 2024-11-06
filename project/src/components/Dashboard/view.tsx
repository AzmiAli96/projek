"use client";
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

const ViewBarang: React.FC = () => {
  const [kode_barang, setKode_Barang] = useState("");
  const [nama_barang, setNama_Barang] = useState("");
  const [ket, setKet] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [harga, setHarga] = useState("");
  const [image, setImage] = useState("");
  const [items, setItems] = useState<Barang[]>([]);

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

  return (
    <div>
      {/* Bagian Hasil */}
      <div className="w-3/4 flex flex-wrap gap-9">
        {items.map((item) => (
          <div key={item.id} className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-4">
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              <img src={item.image} alt={item.nama_barang} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h5 className="text-xl font-semibold text-gray-800">{item.nama_barang}</h5>
                <p className="text-gray-500 mt-2">{item.ket}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-900 font-bold">Rp{item.harga}</span>
                  <span className="text-gray-700">{item.jumlah} pcs</span>
                </div>
                <div className="mt-3">
                  <span className="text-sm text-gray-600">Kode Barang: {item.kode_barang}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
  );
};

export default ViewBarang;
