"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { getUserInfo } from "@/utils/auth";
import jwt from "jsonwebtoken";

type cart = {
    id: number;
    id_user: number;
    id_barang: number;
    jumlah_cart: number;
    barang: {
        kode_barang: string;
        nama_barang: string;
        harga: number;
        jumlah: number;
        ket: string;
        image: string;
    };
};

const Checkout: React.FC = () => {
    const [checkoutItems, setCheckoutItems] = useState<cart[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split("T")[0]); // Default ke hari ini
    const router = useRouter();
    const searchParams = useSearchParams();
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

    // Ambil data dari query parameter
    useEffect(() => {
        const data = searchParams.get("data");
        if (data) {
            try {
                const parsedData = JSON.parse(decodeURIComponent(data)) as { id_barang: number; jumlah: number }[];
    
                // Ambil detail barang dari server
                const fetchItems = async () => {
                    try {
                        const response = await axios.get("/api/cart");
                        const allItems: cart[] = response.data.data;
    
                        if (userId) {
                            // Filter hanya barang milik user yang sedang login
                            const userItems = allItems.filter((item) => item.id_user === userId);
    
                            // Filter berdasarkan id_barang yang dipilih
                            const selectedItems = userItems.filter((item) =>
                                parsedData.some((checkoutItem) => checkoutItem.id_barang === item.id_barang)
                            );
    
                            // Perbarui jumlah barang yang dipilih
                            const updatedItems = selectedItems.map((item) => {
                                const matchingItem = parsedData.find(
                                    (checkoutItem) => checkoutItem.id_barang === item.id_barang
                                );
                                return {
                                    ...item,
                                    jumlah_cart: matchingItem ? matchingItem.jumlah : item.jumlah_cart,
                                };
                            });
    
                            setCheckoutItems(updatedItems);
    
                            // Hitung total harga
                            const total = updatedItems.reduce(
                                (sum, item) => sum + item.barang.harga * item.jumlah_cart,
                                0
                            );
                            setTotalPrice(total);
                        }
                    } catch (error) {
                        console.error("Error fetching items:", error);
                    }
                };
    
                fetchItems();
            } catch (error) {
                console.error("Invalid query data:", error);
            }
        }
    }, [searchParams, userId]);
    

    const handleSubmit = async () => {
        if (!userId) {
            toast.error("Anda harus login sebelum melakukan pemesanan.");
            return;
        }
    
        if (checkoutItems.length === 0) {
            toast.error("Tidak ada barang untuk dipesan!");
            return;
        }
    
        try {
            const orders = checkoutItems.map((item) => ({
                idCart: item.id,
                id_user: userId, // Pastikan userId sesuai
                id_barang: item.id_barang,
                tanggal: new Date().toISOString(),
                jumlah_beli: item.jumlah_cart,
                status: "belum bayar",
                keputusan: "dalam proses",
            }));
    
            const response = await axios.post("/api/checkout", orders, {
                headers: { "Content-Type": "application/json" },
            });
    
            toast.success("Pemesanan Berhasil Dilakukan");
            router.push("/customers/pesanan");
        } catch (error) {
            console.error("Gagal memesan barang:", error);
            toast.error("Gagal melakukan pemesanan. Silahkan coba lagi.");
        }
    };
    

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow">
                <h1 className="text-2xl font-bold mb-6">Checkout</h1>

                <div className="flex gap-8">
                    {/* Table Barang */}
                    <div className="w-3/4">
                        {checkoutItems.length > 0 ? (
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-stroke">
                                        <th className="p-4 text-left">Produk</th>
                                        <th className="p-4 text-center">Jumlah</th>
                                        <th className="p-4 text-center">Harga Satuan</th>
                                        <th className="p-4 text-center">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {checkoutItems.map((item) => (
                                        <tr key={item.id} className="border-b border-stroke">
                                            {/* Produk */}
                                            <td className="p-4 flex items-center gap-4">
                                                <img
                                                    src={item.barang.image}
                                                    alt={item.barang.nama_barang}
                                                    className="w-20 h-20 rounded"
                                                />
                                                <div>
                                                    <p className="font-semibold">{item.barang.nama_barang}</p>
                                                    <p className="text-sm text-gray-500">{item.barang.kode_barang}</p>
                                                </div>
                                            </td>

                                            {/* Jumlah */}
                                            <td className="p-4 text-center">{item.jumlah_cart}</td>

                                            {/* Harga Satuan */}
                                            <td className="p-4 text-center">
                                                Rp {item.barang.harga.toLocaleString("id-ID")}
                                            </td>

                                            {/* Total */}
                                            <td className="p-4 text-center font-semibold">
                                                Rp {(item.barang.harga * item.jumlah_cart).toLocaleString("id-ID")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-center text-gray-500">Tidak ada barang dalam keranjang checkout.</p>
                        )}
                    </div>

                    {/* Total Harga dan Tombol */}
                    <div className="w-1/4 border-l pl-6">
                        <h2 className="text-xl font-bold mb-4">Ringkasan Belanja</h2>
                        <p className="text-lg">
                            Total Harga:
                            <span className="font-semibold text-blue-600 ml-2">
                                Rp {totalPrice.toLocaleString("id-ID")}
                            </span>
                        </p>

                        <button
                            className="w-full mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={handleSubmit}
                        >
                            Pesan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
