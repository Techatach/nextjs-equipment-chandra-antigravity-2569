import AddProductForm from "@/components/AddProductForm";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "กรอกรายการครุภัณฑ์ - มหาวิทยาลัยราชภัฏจันทรเกษม",
  description: "แบบฟอร์มกรอกรายการครุภัณฑ์ใหม่ คณะมนุษยศาสตร์และสังคมศาสตร์",
};

export default function AddProductPage() {
  return (
    <main className="min-h-screen bg-gray-50/50 py-4">
      <AddProductForm />
    </main>
  );
}
