import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Pemesanan from "@/components/Customers/pemesanan";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function pesanPage({ params }: { params: { id: string } }) {
  return (
    <>
      <DefaultLayout>
      <Toaster position="top-right" reverseOrder={false}/>
        <Pemesanan/>
      </DefaultLayout>
    </>
  );
}