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

const Rekap = () => {
  const [pengeluaran, setPengeluaran] = useState<Pengeluaran[]>([]);
  const [pembelian, setPembelian] = useState<Pembelian[]>([]);
  const [rekapHarian, setRekapHarian] = useState<RekapHarian[]>([]);

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

      // Set state untuk rekap harian
      setRekapHarian(Object.values(dataByDate));
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
            {rekapHarian.map((item, index) => (
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
      </div>
    </div>
  );
};

export default Rekap;
