"use client";

import React, { useState } from "react";
import Loading from "@/app/loading";
import ProductItem from "./ProductItem";
import Title from "./Title";
import { useAllProducts } from "@/lib/productAction";
import Button from "@mui/material/Button";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

export default function AllProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const { products, isLoading, error, mutate } = useAllProducts();

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] p-4 text-center">
        <div className="text-red-500 font-semibold mb-2">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>
        <p className="text-gray-600 text-sm mb-4">{error.message}</p>
        <Button variant="outlined" color="primary" onClick={() => mutate()}>
          ลองใหม่อีกครั้ง
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  const filteredProducts = products.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      item.name?.toLowerCase().includes(q) ||
      String(item.num1 || "").toLowerCase().includes(q) ||
      item.building?.toLowerCase().includes(q) ||
      item.respondent?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col justify-start items-center w-full max-w-7xl mx-auto px-4 py-6 min-h-screen">
      <Title text="รายการครุภัณฑ์ทั้งหมด" />

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4 mb-6">
        <div className="flex gap-2 w-full sm:w-auto">
          <Link href="/AddProduct" passHref>
            <Button
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              className="whitespace-nowrap"
            >
              เพิ่มครุภัณฑ์
            </Button>
          </Link>
          <Link href="/scan" passHref>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<QrCodeScannerIcon />}
              className="whitespace-nowrap"
            >
              สแกน QR
            </Button>
          </Link>
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="ค้นหาชื่อ, หมายเลขครุภัณฑ์, สถานที่..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered input-accent w-full text-sm"
          />
        </div>
      </div>

      {/* Grid view */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col justify-center items-center w-full py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-center">
          <div className="text-lg font-medium text-gray-500 mb-2">
            {searchTerm ? "ไม่พบครุภัณฑ์ที่ตรงกับคำค้นหา" : "ยังไม่มีข้อมูลครุภัณฑ์ในระบบ"}
          </div>
          <Link href="/AddProduct">
            <Button variant="contained" color="success" size="small" startIcon={<AddIcon />}>
              เพิ่มรายการแรก
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
          {filteredProducts.map((item) => (
            <ProductItem
              key={item._id || item.num1}
              data={item}
              refreshProducts={() => mutate()}
            />
          ))}
        </div>
      )}
    </div>
  );
}
