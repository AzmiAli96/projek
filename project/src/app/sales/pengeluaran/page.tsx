import Pengeluaran from "@/components/Pengeluaran";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";


const PengeluaranPage = () => {
  return (
    <DefaultLayout>
      <Pengeluaran/>
    </DefaultLayout>
  );
};

export default PengeluaranPage;