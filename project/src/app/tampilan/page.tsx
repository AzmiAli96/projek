import view from "@/components/Dashboard/view";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ViewBarang from "@/components/Dashboard/view";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function ViewPage() {
  return (
    <>
      <DefaultLayout>
        <ViewBarang/>
      </DefaultLayout>
    </>
  );
}
