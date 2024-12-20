"use client";

import axios from "axios";
import { useEffect, useState } from "react";

type Barang = {
    id: number;
    kode_barang: string;
    nama_barang: string;
    ket: string;
    harga: number;
    jumlah: number;
    image: string;
};

const ITEMS_PER_PAGE = 10;

const Stock = () => {
    const [items, setItems] = useState<Barang[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredBarang, setFilteredBarang] = useState<Barang[]>([]);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get("/api/barang");
            setItems(response.data.data);
        };
        fetchData();
    }, []);

    // Filter dan Sort Data
    useEffect(() => {
        let updatedBarang = [...items];

        // Filter berdasarkan searchTerm
        if (searchTerm) {
            updatedBarang = updatedBarang.filter(
                (item) =>
                    item.kode_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Urutkan berdasarkan jumlah ASC/DESC
        updatedBarang.sort((a, b) => {
            return sortOrder === "asc" ? a.jumlah - b.jumlah : b.jumlah - a.jumlah;
        });

        setFilteredBarang(updatedBarang);
    }, [items, searchTerm, sortOrder]);

    // Handle Search Input
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset ke halaman pertama saat filter berubah
    };

    // Toggle Sort Order
    const toggleSortOrder = () => {
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    };

    // Pagination
    const totalPages = Math.ceil(filteredBarang.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = filteredBarang.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Input dan Tombol Sorting */}
            <div className="flex items-center gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Cari barang..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="border p-2 rounded"
                />
                <button
                    onClick={toggleSortOrder}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Urutkan: {sortOrder === "asc" ? "ASC" : "DESC"}
                </button>
            </div>

            {/* Tabel */}
            <table className="table-fixed w-full border border-stroke bg-white shadow-lg rounded-lg">
                <thead className="font-semibold text-black bg-gray-200">
                    <tr>
                        <td className="w-1/12 p-4 text-center border-b">ID</td>
                        <td className="w-2/12 p-4 text-center border-b">Kode Barang</td>
                        <td className="w-3/12 p-4 text-center border-b">Nama Barang</td>
                        <td className="w-2/12 p-4 text-center border-b">Harga</td>
                        <td className="w-2/12 p-4 text-center border-b">Jumlah</td>
                    </tr>
                </thead>
                <tbody className="text-black">
                    {currentItems.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-100 transition-colors">
                            <td className="p-4 text-center border-b">{item.id}</td>
                            <td className="p-4 text-center border-b">{item.kode_barang}</td>
                            <td className="p-4 text-center border-b">{item.nama_barang}</td>
                            <td className="p-4 text-center border-b">{item.harga}</td>
                            <td className="p-4 text-center border-b">{item.jumlah}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-4 py-2 rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Stock;
