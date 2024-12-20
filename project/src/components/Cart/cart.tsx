"use client";

import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import axios from "axios";
import { useRouter } from "next/navigation";

type cart = {
    id: number;
    id_user: number;
    id_barang: number;
    jumlah_cart: number;
    barang: {
        kode_barang: string,
        nama_barang: string,
        harga: number,
        jumlah: number,
        ket: string,
        image: string,
    }
}

const Cart: React.FC = () => {
    const [cartItems, setCartItems] = useState<cart[]>([]);
    const [userId, setUserId] = useState<number | null>(null);
    const [isChecked, setIsChecked] = useState<boolean[]>([]);
    const [quantityMap, setQuantityMap] = useState<{ [key: number]: number }>({});
    const router = useRouter();

    // Ambil token user dan decode userId
    useEffect(() => {
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];

        if (token) {
            try {
                const decoded = jwt.decode(token) as { id: number };
                setUserId(decoded.id);
            } catch (error) {
                console.error("Invalid token:", error);
            }
        }
    }, []);

    // Ambil data cart dari server
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get("/api/cart");
                const allCartItems = response.data.data as cart[];
                setCartItems(allCartItems);
                setIsChecked(new Array(allCartItems.length).fill(false));
                const initialQuantities: { [key: number]: number } = {};
                allCartItems.forEach((item) => {
                    initialQuantities[item.id] = item.jumlah_cart;
                });
                if (userId) {
                    const userCart = allCartItems.filter((cartItems) => cartItems.id_user === userId);
                    setCartItems(userCart);
                }
                setQuantityMap(initialQuantities);
            } catch (error) {
                console.error("Error fetching cart items:", error);
            }
        };

        if (userId) fetchCart();
    }, [userId]);

    const handleQuantityChange = (id: number, delta: number, stock: number) => {
        setQuantityMap((prev) => {
            const updated = { ...prev };
            const newQuantity = updated[id] + delta;
            if (newQuantity > 0 && newQuantity <= stock) {
                updated[id] = newQuantity;
            }
            return updated;
        });
    };

    const handleCheckboxChange = (index: number) => {
        setIsChecked((prev) => {
            const newChecked = [...prev];
            newChecked[index] = !newChecked[index];
            return newChecked;
        });
    };

    const calculateTotalPrice = (item: cart) => {
        return item.barang.harga * quantityMap[item.id];
    };

    // Checkout hanya item yang dipilih
    const handleCheckout = () => {
        const selectedItems = cartItems.filter((_, index) => isChecked[index]);
        const checkoutData = selectedItems.map((item) => ({
            id_barang: item.id_barang,
            jumlah: quantityMap[item.id],
        }));

        console.log("Checkout Data:", checkoutData);
        // Redirect ke halaman checkout dengan data di URL atau state
        router.push(`/customers/checkout?data=${encodeURIComponent(JSON.stringify(checkoutData))}`);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Keranjang Belanja</h1>
            {cartItems.map((item, index) => (
                <div
                    key={item.id}
                    className="bg-white rounded-lg shadow p-4 mb-4 flex items-center justify-between"
                >
                    <input
                        type="checkbox"
                        checked={isChecked[index]}
                        onChange={() => handleCheckboxChange(index)}
                        className="mr-4"
                    />
                    <img
                        src={item.barang.image}
                        alt={item.barang.nama_barang}
                        className="w-20 h-20 rounded"
                    />
                    <div className="flex-1 ml-4">
                        <h2 className="font-semibold text-lg">
                            {item.barang.nama_barang} ({item.barang.kode_barang})
                        </h2>
                        <p className="text-gray-500">Harga: Rp {item.barang.harga.toLocaleString("id-ID")}</p>
                        <p className="text-gray-500">
                            Stok: <span className="text-green-500">{item.barang.jumlah}</span>
                        </p>
                        <div className="flex items-center mt-2">
                            <button
                                onClick={() => handleQuantityChange(item.id, -1, item.barang.jumlah)}
                                className="px-2 py-1 bg-gray-200 rounded-l"
                            >
                                -
                            </button>
                            <span className="px-4 py-1 border border-gray-300">
                                {quantityMap[item.id]}
                            </span>
                            <button
                                onClick={() => handleQuantityChange(item.id, 1, item.barang.jumlah)}
                                className="px-2 py-1 bg-gray-200 rounded-r"
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-gray-700">
                            Total: Rp {calculateTotalPrice(item).toLocaleString("id-ID")}
                        </p>
                    </div>
                </div>
            ))}
            <button
                onClick={handleCheckout}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Pesan Sekarang
            </button>
        </div>
    );
};

export default Cart;