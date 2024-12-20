"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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
  keputusan: string;
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
  // const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1); // Default bulan ini
  // const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear()); // Default tahun ini
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMonth, setModalMonth] = useState<number>(new Date().getMonth() + 1);
  const [modalYear, setModalYear] = useState<number>(new Date().getFullYear());



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
        const hutang =
          item.keputusan === "Tolak" || item.keputusan === "dalam proses"
            ? penghasilan
            : 0;

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

  const handleDownloadPDF = (month: number, year: number) => {
    const doc = new jsPDF();

    // Filter data berdasarkan bulan dan tahun
    const filteredData = rekapHarian.filter((item) => {
      const itemDate = new Date(item.tanggal);
      return itemDate.getMonth() + 1 === month && itemDate.getFullYear() === year;
    });

    // Hitung total
    const totalKotor = filteredData.reduce(
      (sum, item) => sum + item.totalPenghasilanKotor,
      0
    );
    const totalPengeluaran = filteredData.reduce(
      (sum, item) => sum + item.totalPengeluaran,
      0
    );
    const totalHutang = filteredData.reduce((sum, item) => sum + item.totalHutang, 0);
    const totalBersih = totalKotor - totalPengeluaran - totalHutang;

    // Tambahkan judul ke dokumen
    doc.setFontSize(16);
    doc.text(
      `Rekap Data Keuangan Bulan ${new Date(0, month - 1).toLocaleString("id-ID", {
        month: "long",
      })} ${year}`,
      14,
      16
    );

    // Buat tabel menggunakan autoTable
    autoTable(doc, {
      head: [["No", "Tanggal", "Penghasilan Kotor", "Pengeluaran", "Hutang", "Bersih"]],
      body: filteredData.map((item, index) => [
        index + 1,
        new Date(item.tanggal).toLocaleDateString("id-ID"),
        item.totalPenghasilanKotor.toLocaleString("id-ID"),
        item.totalPengeluaran.toLocaleString("id-ID"),
        item.totalHutang.toLocaleString("id-ID"),
        item.totalPenghasilanBersih.toLocaleString("id-ID"),
      ]),
      startY: 30,
      didDrawPage: (data) => {
        // Tambahkan total ke dokumen pada akhir tabel
        if (data.cursor) {
          const finalY = data.cursor.y + 10; // Posisi di bawah tabel
          const pageWidth = doc.internal.pageSize.getWidth(); // Lebar halaman
          const marginRight = 14; // Margin kanan
          const marginLeft = 14; // Margin kiri

          // Tambahkan garis horizontal di atas "Total Bersih"
          doc.setDrawColor(0); // Warna hitam untuk garis
          doc.line(marginLeft, finalY + 25, pageWidth - marginRight, finalY + 25); // Garis horizontal

          // Tambahkan teks total dengan label di kiri dan nilai di kanan
          doc.text(`Total Kotor:`, marginLeft, finalY); // Label di kiri
          doc.text(`Rp ${totalKotor.toLocaleString("id-ID")}`, pageWidth - marginRight, finalY, {
            align: "right",
          });

          doc.text(`Total Pengeluaran:`, marginLeft, finalY + 10); // Label di kiri
          doc.text(`Rp ${totalPengeluaran.toLocaleString("id-ID")}`, pageWidth - marginRight, finalY + 10, {
            align: "right",
          });

          doc.text(`Total Belum Pembayaran:`, marginLeft, finalY + 20); // Label di kiri
          doc.text(`Rp ${totalHutang.toLocaleString("id-ID")}`, pageWidth - marginRight, finalY + 20, {
            align: "right",
          });

          doc.text(`Total Bersih:`, marginLeft, finalY + 30); // Label di kiri
          doc.text(`Rp ${totalBersih.toLocaleString("id-ID")}`, pageWidth - marginRight, finalY + 30, {
            align: "right",
          });
        }

      },
    });

    // Simpan dokumen
    doc.save(`Rekap_Keuangan_${month}_${year}.pdf`);
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
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 bg-blue-500 text-white rounded"
          >
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
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Pilih Bulan dan Tahun</h2>
            <div className="mb-4">
              <label>Bulan:</label>
              <select
                value={modalMonth}
                onChange={(e) => setModalMonth(Number(e.target.value))}
                className="border border-gray-300 rounded-md p-2"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("id-ID", { month: "long" })}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label>Tahun:</label>
              <input
                type="number"
                value={modalYear}
                onChange={(e) => setModalYear(Number(e.target.value))}
                className="border border-gray-300 rounded-md p-2"
                placeholder="Masukkan tahun"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  handleDownloadPDF(modalMonth, modalYear);
                  setIsModalOpen(false);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Rekap;
