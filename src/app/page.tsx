import ProductList from "@/components/ProductList";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ระบบจัดการครุภัณฑ์ - คณะมนุษยศาสตร์และสังคมศาสตร์",
  description: "ระบบบริหารจัดการและตรวจเช็คครุภัณฑ์ คณะมนุษยศาสตร์และสังคมศาสตร์ มหาวิทยาลัยราชภัฏจันทรเกษม",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50/50">
      <ProductList />
    </main>
  );
}
