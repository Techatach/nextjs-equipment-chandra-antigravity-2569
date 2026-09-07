"use client";

import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import Button from "@mui/material/Button";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import { IProduct } from "@/types/product";

interface QRCodeModalProps {
  product: IProduct | null;
  onClose: () => void;
}

export default function QRCodeModal({ product, onClose }: QRCodeModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!product) return null;

  const qrValue = product.qrcode || product.num1 || "";

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("กรุณาอนุญาตให้เปิด Pop-up เพื่อพิมพ์ป้าย QR Code");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>ป้าย QR Code - ${product.num1}</title>
          <style>
            @page { size: auto; margin: 10mm; }
            body {
              font-family: 'Kanit', sans-serif, Arial;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 20px;
              color: #111;
            }
            .label-card {
              border: 2px solid #000;
              border-radius: 8px;
              padding: 16px;
              text-align: center;
              max-width: 320px;
              box-sizing: border-box;
            }
            .title { font-size: 14px; font-weight: bold; margin-bottom: 4px; }
            .subtitle { font-size: 12px; color: #555; margin-bottom: 12px; }
            .qr-wrapper { margin: 10px auto; display: inline-block; }
            .code-text { font-size: 16px; font-weight: bold; margin: 8px 0 4px; }
            .name-text { font-size: 13px; margin-bottom: 4px; }
            .location-text { font-size: 11px; color: #444; }
          </style>
        </head>
        <body>
          <div class="label-card">
            <div class="title">คณะมนุษยศาสตร์และสังคมศาสตร์</div>
            <div class="subtitle">มหาวิทยาลัยราชภัฏจันทรเกษม</div>
            <div class="qr-wrapper">
              ${printContent.querySelector("svg")?.outerHTML || ""}
            </div>
            <div class="code-text">${product.num1}</div>
            <div class="name-text">${product.name}</div>
            <div class="location-text">สถานที่: ${product.building || "-"}</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transition-all">
        {/* Header */}
        <div className="flex justify-between items-center bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-6 py-4">
          <h3 className="text-lg font-bold">QR Code ประจำครุภัณฑ์</h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-1 transition"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col items-center text-center" ref={printRef}>
          <div className="bg-white p-4 border-2 border-dashed border-emerald-500 rounded-xl shadow-inner mb-4">
            <QRCodeSVG
              value={qrValue}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="space-y-1 text-gray-800">
            <div className="text-xl font-bold text-emerald-700">{product.num1}</div>
            <div className="font-semibold text-base">{product.name}</div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">สถานที่:</span> {product.building || "-"} |{" "}
              <span className="font-medium">ผู้ดูแล:</span> {product.respondent || "-"}
            </div>
            <div className="text-xs text-gray-400 mt-2">
              รหัสสแกน: {qrValue}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between gap-3 border-t">
          <Button
            variant="outlined"
            onClick={onClose}
            color="inherit"
            className="w-1/2"
          >
            ปิดหน้าต่าง
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            className="w-1/2"
          >
            พิมพ์ป้าย QR
          </Button>
        </div>
      </div>
    </div>
  );
}
