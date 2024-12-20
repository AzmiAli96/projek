import Pembayaran from "@/components/Pembayaran";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Stock from "@/components/Rekap/stock";


const RekapPage = () => {
  return (
    <DefaultLayout>
      <Stock/>
    </DefaultLayout>
  );
};

export default RekapPage;
