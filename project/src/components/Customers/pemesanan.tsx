"use client";
import { FormEvent, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

import axios from 'axios';

type Barang = {
  id: number;
  kode_barang: string;
  nama_barang: string;
  ket: string;
  harga: number;
  jumlah: number;
  image: string;
};

type pembayaran = {
  id_user: number
    id_barang: number
    tanggal: Date
    jumlah_beli: number
    status: string
}



const Pemesanan: React.FC = () => {

  // --------------------------------- MENAMPILKAN DATA BARANG BERDASARKAN ID-----------------------------
  const { id } = useParams(); // Ambil parameter id dari URL
  const [barang, setBarang] = useState<Barang | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const response = await axios.get(`/api/barang/${id}`);
        setBarang(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data barang:", error);
        setLoading(false);
      }
    };

    if (id) {
      fetchBarang();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!barang) return <div>Barang tidak ditemukan.</div>;

  // --------------------END MENAMPIKAN BARANG----------------------------

  const [id_user, setid_user] = useState("");
  const [id_barang, setid_barang] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [jumlah_beli, setJumlah_beli] = useState("");
  const [status, setStatus] = useState("");
  const [items, setItems] = useState("");

  useEffect(() => {
    const itemData =  async () => {
      const response = await axios.get("/api/pemesanan");
      setItems(response.data.data)
    }
    itemData();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) =>{
    e.preventDefault()

    try {
      const item = await axios.post("/api/pemesanan",{
        id_user: id_user,
        id_barang: id_barang,
        tanggal: tanggal,
        jumlah_beli: jumlah_beli,
        status: status,
      },{
        headers: {"Content-Type": "application/json"}
      });

      console.log(item);
      setid_user('');
      setid_barang('');
      setTanggal('');
      setJumlah_beli('');
      setStatus('');
      setid_user('');
    } catch (error) {
      console.log("gagal memesan barang");
    }
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6.5">
      <div className="flex">
        <div className="w-1/2 flex items-center justify-center">
          <img 
            src={barang.image} 
            alt={barang.nama_barang} 
            style={{ width: '400px', height: '400px', borderRadius: '8px' }} 
          />
        </div>
        <div className="w-1/2 px-4">
          <h1 className="text-4xl font-bold text-black">Detail Barang: {barang.nama_barang}</h1>
          <p className="mt-2">Keterangan: {barang.ket}</p>
          <p>Harga: Rp{barang.harga}</p>
          <p>Jumlah: {barang.jumlah} pcs</p>
          <p>Kode Barang: {barang.kode_barang}</p>
        </div>
      </div>
    </div>
  );
    
};

export default Pemesanan;
