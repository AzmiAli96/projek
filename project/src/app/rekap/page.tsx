import Pembayaran from "@/components/Pembayaran";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Rekap from "@/components/Rekap/rekap";


const RekapPage = () => {
  return (
    <DefaultLayout>
      <Rekap/>
    </DefaultLayout>
  );
};

export default RekapPage;
