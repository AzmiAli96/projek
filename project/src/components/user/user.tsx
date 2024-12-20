"use client";

import axios from "axios";
import { FormEvent, useEffect, useState } from "react";

type user = {
    id: number
    name: string
    email: string
    password: string
    level: string
    nohp: string
    alamat: string
};

const ITEMS_PER_PAGE = 10;

const User: React.FC = () => {
    const [items, setItems] = useState<user[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // State untuk form input
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        nohp: "",
        alamat: "",
        level: "",
    });

    useEffect(() => {
        const itemData = async () => {
            try {
                const response = await axios.get("/api/user/");
                setItems(response.data.data);
            } catch (error) {
                console.error("Gagal menambil data user");
            }
        };
        itemData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || "pendaftaran gagal")
            }

            // Setelah sukses, reset form dan tutup modal
            setFormData({ name: "", email: "", password: "", nohp: "", alamat: "", level: "" });
            setShowModal(false);

            // Refresh data
            const updatedData = await axios.get("/api/user");
            setItems(updatedData.data.data);

        } catch (error) {
            console.error("Gagal menagmbil meregister", error);
        }
    }

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    // ----------------------------- PAGINATION ---------------------------------
    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
    const startIdex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = items.slice(startIdex, startIdex + ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    }
    // ----------------------------- END PAGINATION ---------------------------------

    return (
        <div className="flex flex-row gap-9">
            <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                    Informasi User
                </h4>
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={openModal}
                        className="p-2 bg-blue-500 text-white rounded">
                        Insert
                    </button>
                </div>
                <table className="table-fixed w-full border border-stroke bg-white shadow-lg rounded-lg overflow-hidden mb-5">
                    <thead className="font-semibold text-black bg-gray-200">
                        <tr>
                            <td className="w-1/12 p-4 text-center border-b border-stroke">No</td>
                            <td className="w-2/12 p-4 text-center border-b border-stroke">Name</td>
                            <td className="w-2/12 p-4 text-center border-b border-stroke">Email</td>
                            <td className="w-3/12 p-4 text-center border-b border-stroke">nohp</td>
                            <td className="w-2/12 p-4 text-center border-b border-stroke">Alamat</td>
                            <td className="w-2/12 p-4 text-center border-b border-stroke">Level</td>
                        </tr>
                    </thead>
                    <tbody className="text-black">
                        {currentItems.map((item: user, index) => (
                            <tr key={index}>
                                <td className="p-4 text-center border-b border-stroke">{index + 1}</td>
                                <td className="p-4 text-center border-b border-stroke">{item.name}</td>
                                <td className="p-4 text-center border-b border-stroke">{item.email}</td>
                                <td className="p-4 text-center border-b border-stroke">{item.nohp}</td>
                                <td className="p-4 text-center border-b border-stroke">{item.alamat}</td>
                                <td className="p-4 text-center border-b border-stroke">{item.level}</td>
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
            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
                        {/* Close Button */}
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                            onClick={closeModal}
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Insert User</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-1">Name</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">No HP</label>
                                <input
                                    type="nohp"
                                    name="nohp"
                                    value={formData.nohp}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Alamat</label>
                                <input
                                    name="alamat"
                                    value={formData.alamat}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Level</label>
                                <input
                                    name="level"
                                    value={formData.level}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white p-2 rounded"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default User;