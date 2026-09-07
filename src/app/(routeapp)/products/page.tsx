import ProductList from "@/components/ProductList";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "รายการครุภัณฑ์ - มหาวิทยาลัยราชภัฏจันทรเกษม",
  description: "รายการครุภัณฑ์ทั้งหมด คณะมนุษยศาสตร์และสังคมศาสตร์",
};

export default function AllProductPage() {
  return (
    <main className="min-h-screen bg-gray-50/50">
      <ProductList />
    </main>
  );
}
