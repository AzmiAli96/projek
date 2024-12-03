"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

type Pengeluaran = {
  jenis_pengeluaran: string;
  ket: string;
  biaya: number;
  tanggal: string; // Format tanggal sebagai string
};

type Pembelian = {
  id_barang: number;
  id_user: number;
  tanggal: string; // Format tanggal sebagai string
  jumlah_beli: number;
  status: string;
  barang: {
    kode_barang: string;
    nama_barang: string;
    harga: number;
  };
};

type RekapHarian = {
  tanggal: string;
  totalPengeluaran: number;
  totalPenghasilanKotor: number;
  totalPenghasilanBersih: number;
  totalHutang: number;
};

const ITEMS_PER_PAGE = 15;

const Rekap = () => {
  const [pengeluaran, setPengeluaran] = useState<Pengeluaran[]>([]);
  const [pembelian, setPembelian] = useState<Pembelian[]>([]);
  const [rekapHarian, setRekapHarian] = useState<RekapHarian[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredBarang, setFilteredBarang] = useState<RekapHarian[]>([]);

  useEffect(() => {
    const fetchPengeluaran = async () => {
      try {
        const response = await axios.get("/api/pengeluaran");
        setPengeluaran(response.data.data);
      } catch (error) {
        console.error("Data pengeluaran not found", error);
      }
    };

    const fetchPembelian = async () => {
      try {
        const response = await axios.get("/api/pemesanan");
        setPembelian(response.data.data);
      } catch (error) {
        console.error("Data pemesanan not found", error);
      }
    };

    fetchPengeluaran();
    fetchPembelian();
  }, []);

  useEffect(() => {
    const calculateRekapHarian = () => {
      const dataByDate: { [key: string]: RekapHarian } = {};

      // Proses data pengeluaran
      pengeluaran.forEach((item) => {
        if (!dataByDate[item.tanggal]) {
          dataByDate[item.tanggal] = {
            tanggal: item.tanggal,
            totalPengeluaran: 0,
            totalPenghasilanKotor: 0,
            totalPenghasilanBersih: 0,
            totalHutang: 0,
          };
        }
        dataByDate[item.tanggal].totalPengeluaran += Number(item.biaya) || 0;
      });

      // Proses data pembelian
      pembelian.forEach((item) => {
        if (!dataByDate[item.tanggal]) {
          dataByDate[item.tanggal] = {
            tanggal: item.tanggal,
            totalPengeluaran: 0,
            totalPenghasilanKotor: 0,
            totalPenghasilanBersih: 0,
            totalHutang: 0,
          };
        }

        const penghasilan = (Number(item.barang?.harga) || 0) * (Number(item.jumlah_beli) || 0);
        const hutang = item.status.includes("/upload") ? 0 : penghasilan;

        dataByDate[item.tanggal].totalPenghasilanKotor += penghasilan;
        dataByDate[item.tanggal].totalHutang += hutang;
      });

      // Hitung total penghasilan bersih (kotor - pengeluaran - hutang)
      Object.values(dataByDate).forEach((data) => {
        data.totalPenghasilanBersih =
          data.totalPenghasilanKotor - data.totalPengeluaran - data.totalHutang;
      });

      // Konversi objek ke array dan urutkan berdasarkan tanggal (terbaru ke terlama)
      const sortedData = Object.values(dataByDate).sort((a, b) => {
        return new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime();
      });

      // Set state untuk rekap harian
      setRekapHarian(sortedData);
    };

    calculateRekapHarian();
  }, [pengeluaran, pembelian]
  );

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Judul PDF
    doc.setFontSize(16);
    doc.text("Rekap Data Keuangan Harian", 14, 16);

    // Kolom untuk tabel
    const tableColumn = [
      "No",
      "Tanggal",
      "Penghasilan Kotor",
      "Pengeluaran",
      "Hutang",
      "Penghasilan Bersih"
    ];

    // Isi data untuk tabel
    const tableRow = rekapHarian.map((item, index) => [
      index + 1,
      new Date(item.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "long" }),
      item.totalPenghasilanKotor.toString(),
      item.totalPengeluaran.toString(),
      item.totalHutang.toString(),
      item.totalPenghasilanBersih.toString(),
    ]);

    // Memanggil autoTable untuk menambahkan tabel
    // doc.autoTable({
    //   head: [tableColumn], // Kolom header
    //   body: tableRow,      // Baris data
    //   startY: 30,          // Menentukan posisi Y untuk tabel
    // });

    // Simpan file PDF
    doc.save("Rekap_Keuangan.pdf");
  };

   // ---------------------- SEARCH ---------------------------------
   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Filter barang berdasarkan kode_barang atau nama_barang
    const filtered = rekapHarian.filter(
      (rekapHarian) =>
        rekapHarian.tanggal.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredBarang(filtered);
  };
  const barangToDisplay = searchTerm ? filteredBarang : rekapHarian;
  // ---------------------- END SEARCH ---------------------------------

// ----------------------------- PAGINATION ---------------------------------
const totalPages = Math.ceil(barangToDisplay.length / ITEMS_PER_PAGE);
const startIdex = (currentPage - 1) * ITEMS_PER_PAGE;
const currentItems = barangToDisplay.slice(startIdex, startIdex + ITEMS_PER_PAGE);

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
          Informasi Data Keuangan Harian
        </h4>
        <button
          onClick={handleDownloadPDF}
          className="mb-6 p-2 bg-blue-500 text-white rounded">
          Download PDF
        </button>
        <div className="flex justify-end items-center space-x-4 mb-4">
        <label className="font-bold text-color-black ">Bulan : 
          <input
            type="text"
            placeholder="Pencarian Angka Bulan"
            className="border border-gray-300 rounded-md p-2 w-64"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </label>
      </div>
        <table className="table-fixed w-full border border-stroke bg-white shadow-lg rounded-lg overflow-hidden mb-5">
          <thead className="font-semibold text-black bg-gray-200">
            <tr>
              <td className="w-1/12 p-4 text-center border-b border-stroke">No</td>
              <td className="w-2/12 p-4 text-center border-b border-stroke">Tanggal</td>
              <td className="w-2/12 p-4 text-center border-b border-stroke">
                Total Penghasilan Kotor
              </td>
              <td className="w-3/12 p-4 text-center border-b border-stroke">Total Pengeluaran</td>
              <td className="w-2/12 p-4 text-center border-b border-stroke">
                Total Hutang
              </td>
              <td className="w-2/12 p-4 text-center border-b border-stroke">
                Total Penghasilan Bersih
              </td>
            </tr>
          </thead>
          <tbody className="text-black">
            {currentItems.map((item, index) => (
              <tr key={index}>
                <td className="p-4 text-center border-b border-stroke">{index + 1}</td>
                <td className="p-4 text-center border-b border-stroke">{new Date(item.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "long" })}</td>
                <td className="p-4 text-center border-b border-stroke">
                  {item.totalPenghasilanKotor.toLocaleString()}
                </td>
                <td className="p-4 text-center border-b border-stroke">
                  {item.totalPengeluaran.toLocaleString()}
                </td>
                <td className="p-4 text-center border-b border-stroke">
                  {typeof item.totalHutang === "number"
                    ? item.totalHutang.toLocaleString("id-ID")
                    : item.totalHutang}
                </td>
                <td className="p-4 text-center border-b border-stroke">
                  {item.totalPenghasilanBersih.toLocaleString("id-ID")}
                </td>
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
    </div>
  );
};

export default Rekap;
