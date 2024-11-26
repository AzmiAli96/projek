import Pembayaran from "@/components/Pembayaran";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Pesanan from "@/components/Pembayaran/pesanan";


const PesananPage = () => {
  return (
    <DefaultLayout>
      <Pesanan/>
    </DefaultLayout>
  );
};

export default PesananPage;
