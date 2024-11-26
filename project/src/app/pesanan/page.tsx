import Pembayaran from "@/components/Pembayaran";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Pesanan from "@/components/Pembayaran/pesanan";
import { Toaster } from "react-hot-toast";


const PesananPage = () => {
  return (
    <DefaultLayout>
      <Toaster position="top-right" reverseOrder={false}/>
      <Pesanan/>
    </DefaultLayout>
  );
};

export default PesananPage;
