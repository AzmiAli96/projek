"use client";

import Barang from "@/components/Dashboard/Barang";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation"; // Import untuk App Router
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  // Redirect ke halaman login ketika komponen dimuat
  useEffect(() => {
    router.push("/auth/signin");
  }, [router]);

  return (
    <>
      <DefaultLayout>
        <Toaster position="top-right" reverseOrder={false} />
        <Barang />
      </DefaultLayout>
    </>
  );
}
