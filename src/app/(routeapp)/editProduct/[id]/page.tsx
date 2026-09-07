import React from "react";
import EditProductForm from "@/components/EditProductForm";
import { Metadata } from "next";

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: "แก้ไขข้อมูลครุภัณฑ์ - มหาวิทยาลัยราชภัฏจันทรเกษม",
  description: "แบบฟอร์มแก้ไขข้อมูลครุภัณฑ์ คณะมนุษยศาสตร์และสังคมศาสตร์",
};

export default function EditProductPage({ params }: EditProductPageProps) {
  return (
    <main className="min-h-screen bg-gray-50/50 py-4">
      <EditProductForm id={params.id} />
    </main>
  );
}
