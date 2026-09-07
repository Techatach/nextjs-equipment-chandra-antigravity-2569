"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
import Link from "next/link";
import RemoveBtn from "@/components/RemoveBtn";
import EditProductButton from "@/components/EditProductButton";
import QRCodeModal from "@/components/QRCodeModal";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { useAllProducts } from "@/lib/productAction";
import Loading from "@/app/loading";
import { IProduct } from "@/types/product";
import { exportToExcel, exportToWord, exportToPdf } from "@/lib/exportUtils";
import TableViewIcon from "@mui/icons-material/TableView";
import DescriptionIcon from "@mui/icons-material/Description";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

export default function ProductList() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");
  const [selectedProductForQR, setSelectedProductForQR] = useState<IProduct | null>(null);
  const [isExportingWord, setIsExportingWord] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const { products, isLoading, error, mutate } = useAllProducts();

  const handleExportExcel = () => {
    const listToExport = filteredProducts.length > 0 ? filteredProducts : products;
    if (listToExport.length === 0) {
      alert("ยังไม่มีข้อมูลครุภัณฑ์สำหรับดาวน์โหลด");
      return;
    }
    exportToExcel(listToExport);
  };

  const handleExportWord = async () => {
    const listToExport = filteredProducts.length > 0 ? filteredProducts : products;
    if (listToExport.length === 0) {
      alert("ยังไม่มีข้อมูลครุภัณฑ์สำหรับดาวน์โหลด");
      return;
    }
    try {
      setIsExportingWord(true);
      await exportToWord(listToExport);
    } catch (err: any) {
      alert(err.message || "เกิดข้อผิดพลาดในการสร้างเอกสาร Word");
    } finally {
      setIsExportingWord(false);
    }
  };

  const handleExportPdf = async () => {
    const listToExport = filteredProducts.length > 0 ? filteredProducts : products;
    if (listToExport.length === 0) {
      alert("ยังไม่มีข้อมูลครุภัณฑ์สำหรับดาวน์โหลด");
      return;
    }
    try {
      setIsExportingPdf(true);
      await exportToPdf(listToExport);
    } catch (err: any) {
      alert(err.message || "เกิดข้อผิดพลาดในการสร้างเอกสาร PDF");
    } finally {
      setIsExportingPdf(false);
    }
  };

  const getStatusBadge = (stat: string) => {
    switch (stat) {
      case "ปกติ":
        return "bg-green-100 text-green-800 border-green-300";
      case "ชำรุด":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "จำหน่าย":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "สูญหาย":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center p-12 text-center">
        <p className="text-red-500 font-bold mb-3">เกิดข้อผิดพลาดในการโหลดข้อมูลครุภัณฑ์</p>
        <p className="text-sm text-gray-500 mb-4">{error.message}</p>
        <Button variant="outlined" color="primary" onClick={() => mutate()}>
          ลองใหม่อีกครั้ง
        </Button>
      </div>
    );
  }

  const filteredProducts = products.filter((item) => {
    const q = query.toLowerCase().trim();
    const matchesQuery =
      !q ||
      item.name?.toLowerCase().includes(q) ||
      String(item.num1 || "").toLowerCase().includes(q) ||
      item.building?.toLowerCase().includes(q) ||
      item.respondent?.toLowerCase().includes(q) ||
      item.category?.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "ทั้งหมด" || item.stat === statusFilter;

    return matchesQuery && matchesStatus;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              ระบบจัดการครุภัณฑ์
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base mt-1">
              คณะมนุษยศาสตร์และสังคมศาสตร์ มหาวิทยาลัยราชภัฏจันทรเกษม
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Link href="/AddProduct" passHref>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#ffffff",
                  color: "#065f46",
                  "&:hover": { backgroundColor: "#f0fdf4" },
                  fontWeight: "bold",
                }}
                startIcon={<AddIcon />}
              >
                กรอกรายการครุภัณฑ์
              </Button>
            </Link>
            <Link href="/scan" passHref>
              <Button
                variant="outlined"
                sx={{
                  color: "#ffffff",
                  borderColor: "#ffffff",
                  "&:hover": { borderColor: "#d1fae5", backgroundColor: "rgba(255,255,255,0.1)" },
                  fontWeight: "bold",
                }}
                startIcon={<QrCodeScannerIcon />}
              >
                ตรวจเช็ค (QR Code)
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              className="input input-bordered input-accent w-full pl-10 pr-4 text-sm"
              placeholder="ค้นหาชื่อ, หมายเลขครุภัณฑ์, สถานที่..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-gray-500">สถานะ:</span>
            {["ทั้งหมด", "ปกติ", "ชำรุด", "จำหน่าย", "สูญหาย"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  statusFilter === status
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="text-xs font-medium text-gray-500 whitespace-nowrap">
            พบทั้งหมด <span className="font-bold text-emerald-600">{filteredProducts.length}</span> รายการ
          </div>
        </div>

        {/* Export / Download Buttons Toolbar */}
        <div className="flex flex-wrap justify-between items-center pt-3 border-t border-gray-100 gap-3">
          <div className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
            <span>ส่งออกรายงาน:</span>
            <span className="text-gray-400 text-[11px]">(ตามผลลัพธ์การค้นหา {filteredProducts.length} รายการ)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Button
              variant="contained"
              size="small"
              onClick={handleExportExcel}
              sx={{
                backgroundColor: "#107c41",
                "&:hover": { backgroundColor: "#0b5c30" },
                fontWeight: "bold",
                fontSize: "0.82rem",
                borderRadius: "8px",
                textTransform: "none",
                boxShadow: "0 2px 4px rgba(16, 124, 65, 0.2)",
              }}
              startIcon={<TableViewIcon />}
            >
              ดาวน์โหลด Excel (.xlsx)
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleExportWord}
              disabled={isExportingWord}
              sx={{
                backgroundColor: "#2b579a",
                "&:hover": { backgroundColor: "#1d3d6e" },
                fontWeight: "bold",
                fontSize: "0.82rem",
                borderRadius: "8px",
                textTransform: "none",
                boxShadow: "0 2px 4px rgba(43, 87, 154, 0.2)",
              }}
              startIcon={<DescriptionIcon />}
            >
              {isExportingWord ? "กำลังสร้างเอกสาร..." : "ดาวน์โหลด Word (.docx)"}
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              sx={{
                backgroundColor: "#c0392b",
                "&:hover": { backgroundColor: "#96281b" },
                fontWeight: "bold",
                fontSize: "0.82rem",
                borderRadius: "8px",
                textTransform: "none",
                boxShadow: "0 2px 4px rgba(192, 57, 43, 0.2)",
              }}
              startIcon={<PictureAsPdfIcon />}
            >
              {isExportingPdf ? "กำลังสร้างเอกสาร..." : "ดาวน์โหลด PDF (.pdf)"}
            </Button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-left">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase tracking-wider border-b">
              <tr>
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-3 text-center">จัดการ</th>
                <th className="py-3 px-3">รูปภาพ</th>
                <th className="py-3 px-3">หมายเลขครุภัณฑ์</th>
                <th className="py-3 px-3">รายการครุภัณฑ์</th>
                <th className="py-3 px-3">คุณลักษณะ / สเปค</th>
                <th className="py-3 px-3">สถานที่ใช้งาน</th>
                <th className="py-3 px-3">ผู้รับผิดชอบ</th>
                <th className="py-3 px-3 text-right">ราคา (บาท)</th>
                <th className="py-3 px-3 text-center">จำนวน</th>
                <th className="py-3 px-3">วันที่ได้มา</th>
                <th className="py-3 px-3">ปีจัดซื้อ</th>
                <th className="py-3 px-3">วิธีการจัดหา</th>
                <th className="py-3 px-3">งบประมาณ</th>
                <th className="py-3 px-3">ประเภทครุภัณฑ์</th>
                <th className="py-3 px-3">กลุ่มครุภัณฑ์</th>
                <th className="py-3 px-3 text-center">สถานะ</th>
                <th className="py-3 px-3 text-center">QR Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={18} className="py-12 text-center text-gray-400">
                    <Inventory2OutlinedIcon sx={{ fontSize: 48, color: "#9ca3af", mb: 1 }} />
                    <p className="font-medium text-base text-gray-600">
                      {query ? "ไม่พบครุภัณฑ์ที่ตรงกับคำค้นหา" : "ยังไม่มีข้อมูลครุภัณฑ์"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      สามารถกดปุ่ม &quot;กรอกรายการครุภัณฑ์&quot; ด้านบนเพื่อเพิ่มข้อมูลใหม่
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((element, index) => (
                  <tr key={element._id || element.num1 || index} className="hover:bg-emerald-50/40 transition">
                    <td className="py-3 px-3 text-gray-500 font-mono text-xs">{index + 1}</td>
                    {/* ปุ่มจัดการ: แก้ไข + ลบ */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {element._id && <EditProductButton id={element._id} />}
                        {element._id && (
                          <RemoveBtn
                            id={element._id}
                            name={element.name}
                            onDeleted={() => mutate()}
                          />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {element.image ? (
                        <img
                          src={element.image}
                          alt={element.name}
                          className="w-10 h-10 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
                          ไม่มีรูป
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 font-semibold text-emerald-800 whitespace-nowrap">
                      {element.num1}
                    </td>
                    <td className="py-3 px-3 font-medium text-gray-900 max-w-xs truncate" title={element.name}>
                      {element.name}
                    </td>
                    <td className="py-3 px-3 text-gray-500 max-w-[160px] truncate text-xs" title={element.spec || ""}>
                      {element.spec || "-"}
                    </td>
                    <td className="py-3 px-3 text-gray-600 whitespace-nowrap">{element.building || "-"}</td>
                    <td className="py-3 px-3 text-gray-600 whitespace-nowrap">{element.respondent || "-"}</td>
                    <td className="py-3 px-3 text-right font-medium text-gray-800 whitespace-nowrap">
                      {Number(element.price || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-center text-gray-700 whitespace-nowrap">
                      {Number(element.num2 || 1).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-gray-600 whitespace-nowrap">{element.date1 || "-"}</td>
                    <td className="py-3 px-3 text-gray-600 whitespace-nowrap">{element.date2 || "-"}</td>
                    <td className="py-3 px-3 text-gray-600 whitespace-nowrap">{element.method || "-"}</td>
                    <td className="py-3 px-3 text-gray-600 whitespace-nowrap">{element.budget || "-"}</td>
                    <td className="py-3 px-3 text-gray-600 whitespace-nowrap">{element.category || "-"}</td>
                    <td className="py-3 px-3 text-gray-600 whitespace-nowrap">{element.group || "-"}</td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(
                          element.stat || "ปกติ"
                        )}`}
                      >
                        {element.stat || "ปกติ"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Button
                        variant="outlined"
                        size="small"
                        color="info"
                        onClick={() => setSelectedProductForQR(element)}
                        title="ดู QR Code"
                        sx={{ minWidth: "36px", padding: "4px" }}
                      >
                        <QrCode2Icon fontSize="small" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Modal */}
      {selectedProductForQR && (
        <QRCodeModal
          product={selectedProductForQR}
          onClose={() => setSelectedProductForQR(null)}
        />
      )}
    </div>
  );
}
