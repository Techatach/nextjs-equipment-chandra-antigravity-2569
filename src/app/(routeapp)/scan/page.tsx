import React from "react";
import QRScanner from "@/components/QRScanner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ตรวจเช็คครุภัณฑ์ด้วย QR Code - มหาวิทยาลัยราชภัฏจันทรเกษม",
  description: "ระบบสแกน QR Code ตรวจเช็คสถานะครุภัณฑ์ผ่านมือถือ",
};

export default function ScanPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <QRScanner />
    </div>
  );
}
