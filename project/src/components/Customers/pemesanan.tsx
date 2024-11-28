"use client";
import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { getUserInfo } from '@/utils/auth';
import toast from 'react-hot-toast';

type Barang = {
  id: number;
  kode_barang: string;
  nama_barang: string;
  ket: string;
  harga: number;
  jumlah: number;
  image: string;
};

const Pemesanan: React.FC = () => {
  const { id } = useParams(); // Ambil parameter id dari URL

  // State untuk data barang
  const [barang, setBarang] = useState<Barang | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // State untuk form pemesanan
  const [id_user, setIdUser] = useState<number>(0);
  const [id_barang] = useState<number>(Number(id)); // Inisialisasi dengan id dari URL
  const [tanggal, setTanggal] = useState<string>("");
  const [jumlah_beli, setJumlahBeli] = useState<number>(1); // Set default ke tipe number
  const [status, setStatus] = useState<string>("belum bayar");
  const [items, setItems] = useState<any[]>([]);

  // Fetch data barang berdasarkan ID
  useEffect(() => {
    const fetchBarang = async () => {
      if (id) {
        try {
          const response = await axios.get(`/api/barang/${id}`);
          setBarang(response.data.data);
        } catch (error) {
          console.error("Gagal mengambil data barang:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBarang();
  }, [id]);

  // Fetch data pemesanan (hanya dilakukan satu kali)
  useEffect(() => {
    const itemData = async () => {
      try {
        const response = await axios.get("/api/pemesanan");
        setItems(response.data.data || []);
      } catch (error) {
        console.error("Gagal mengambil data pemesanan:", error);
      }
    };

    itemData();
  }, []);

  // Set tanggal otomatis ke hari ini saat komponen dimuat
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setTanggal(today);
  }, []);

  // Handle form submit
  const handleSubmit = async () => {

    try {
      const response = await axios.post(
        "/api/pemesanan",
        {
          id_user: getUserInfo()?.id,
          id_barang,
          tanggal,
          jumlah_beli: quantity,
          status,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("Pemesanan Berhasil Dilakukan");

      console.log(response.data);
      // Reset form fields
      setIdUser(0);
      setTanggal(new Date().toISOString().split("T")[0]);
      setJumlahBeli(1);
      // setStatus("belum bayar");
    } catch (error) {
      console.error("Gagal memesan barang:", error);
      toast.error("Gagal melakukan pemesan. Silahkan coba lagi")
    }
  };

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const totalPrice = barang ? barang.harga * quantity : 0;

  // Render loading atau error
  if (loading) return <div>Loading...</div>;
  if (!barang) return <div>Barang tidak ditemukan.</div>;

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
          <h1 className="text-4xl text-center font-bold text-black mt-4 mb-5">
            {barang.nama_barang} : {barang.kode_barang}
          </h1>
          <hr className="border-0 border-t-2 border-black" />

          <table className="w-full mt-4">
            <tbody className="space-y-4">
              <tr>
                <td className="text-lg font-semibold text-gray-600 pr-6 align-top">Harga</td>
                <td>
                  <div className="text-3xl font-bold text-blue-600">Rp {barang.harga.toLocaleString('id-ID')}</div>
                </td>
              </tr>
              <tr>
                <td className="text-lg font-semibold text-gray-600 pr-6 align-top">Jumlah Stock</td>
                <td>
                  <span className="text-lg text-gray-700">
                    Stock yang tersedia <span className="font-bold text-blue-600">{barang.jumlah}</span>.
                  </span>
                </td>
              </tr>
              <tr>
                <td className="text-lg font-semibold text-gray-600 pr-6 align-top">Estimasi</td>
                <td className="text-lg text-gray-700">Siap dikirim 2-5 hari</td>
              </tr>
              <tr>
                <td className="text-lg font-semibold text-gray-600 pr-6 align-top">Jumlah</td>
                <td>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded">
                      <button onClick={decreaseQuantity} className="px-2 py-1 text-xl font-bold text-gray-600">-</button>
                      <span className="px-4 text-lg">{quantity}</span>
                      <button onClick={increaseQuantity} className="px-2 py-1 text-xl font-bold text-gray-600">+</button>
                    </div>
                    <span className="text-gray-700">Total</span>
                    <span className="text-xl font-bold text-gray-900">
                      Rp {totalPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="text-lg font-semibold text-gray-600 pr-6 align-top">Garansi</td>
                <td className="text-lg text-gray-700">2 hari setelah sampai di tujuan</td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-end mt-6">
            <button onClick={handleSubmit} className="bg-green-500 text-white py-2 px-4 rounded-md" >
              Pesan
            </button>
          </div>
        </div>
      </div>
        <h4 className='max-w-[200px] text-wrap'>{barang.ket}</h4>
    </div>
  );
};

export default Pemesanan;
