"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { IProduct } from "@/types/product";
import { getProductByCode, updateProduct } from "@/lib/productAction";
import Button from "@mui/material/Button";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SearchIcon from "@mui/icons-material/Search";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function QRScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [scannedCode, setScannedCode] = useState<string>("");
  const [manualCode, setManualCode] = useState<string>("");

  const [loadingProduct, setLoadingProduct] = useState(false);
  const [foundProduct, setFoundProduct] = useState<IProduct | null>(null);

  // Form for updating inspection status
  const [inspectStatus, setInspectStatus] = useState<string>("ปกติ");
  const [inspectNote, setInspectNote] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Start Scanner
  const startCamera = async (mode: "environment" | "user" = facingMode) => {
    setScannerError(null);
    try {
      if (scannerRef.current) {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        await scannerRef.current.clear();
      }

      const html5QrCode = new Html5Qrcode("qr-reader-container", {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.EAN_13,
        ],
        verbose: false,
      });

      scannerRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      await html5QrCode.start(
        { facingMode: mode },
        config,
        (decodedText) => {
          handleCodeDetected(decodedText);
        },
        () => {
          // ignore frame errors while scanning
        }
      );

      setIsScanning(true);
    } catch (err: any) {
      console.error("Camera start error:", err);
      setIsScanning(false);
      setScannerError(
        "ไม่สามารถเปิดกล้องได้ กรุณาตรวจสอบการอนุญาตใช้งานกล้อง (Camera Permission) ในเบราว์เซอร์ของคุณ หรือลองใช้วิธีอัปโหลดรูปภาพ / พิมพ์รหัสแทน"
      );
    }
  };

  // Stop Scanner
  const stopCamera = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (err) {
        console.error("Failed to stop scanner:", err);
      }
    }
    setIsScanning(false);
  };

  // Switch between front and back camera
  const toggleCamera = async () => {
    const nextMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextMode);
    if (isScanning) {
      await stopCamera();
      await startCamera(nextMode);
    }
  };

  // When QR code is decoded
  const handleCodeDetected = async (code: string) => {
    const cleanCode = code.trim();
    if (!cleanCode) return;

    // Vibrate device if supported
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(200);
    }

    setScannedCode(cleanCode);
    stopCamera();
    fetchProduct(cleanCode);
  };

  // Fetch product from API
  const fetchProduct = async (code: string) => {
    setLoadingProduct(true);
    setFoundProduct(null);
    setUpdateSuccess(null);
    setScannerError(null);

    try {
      const product = await getProductByCode(code);
      setFoundProduct(product);
      setInspectStatus(product.stat || "ปกติ");
      setInspectNote(product.checkNote || "");
    } catch (err: any) {
      setScannerError(err.message || "ไม่พบข้อมูลครุภัณฑ์ที่ตรงกับรหัสนี้");
    } finally {
      setLoadingProduct(false);
    }
  };

  // Handle file upload scanning
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setScannerError(null);
      await stopCamera();

      const html5QrCode = new Html5Qrcode("qr-reader-container");
      const decodedText = await html5QrCode.scanFile(file, true);
      handleCodeDetected(decodedText);
    } catch (err: any) {
      setScannerError("ไม่พบ QR Code ในรูปภาพที่เลือก กรุณาลองใหม่อีกครั้ง");
    }
  };

  // Handle manual code search
  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    setScannedCode(manualCode.trim());
    stopCamera();
    fetchProduct(manualCode.trim());
  };

  // Submit Inspection Status Update
  const handleSaveInspection = async () => {
    if (!foundProduct?._id) return;

    setIsUpdating(true);
    setUpdateSuccess(null);
    try {
      const now = new Date().toLocaleString("th-TH");
      const updated = await updateProduct(foundProduct._id, {
        stat: inspectStatus,
        lastCheckedDate: now,
        checkNote: inspectNote,
      });

      setFoundProduct(updated);
      setUpdateSuccess(`บันทึกผลการตรวจเช็คสำเร็จเมื่อ ${now}`);
    } catch (err: any) {
      alert(err.message || "ไม่สามารถบันทึกผลการตรวจเช็คได้");
    } finally {
      setIsUpdating(false);
    }
  };

  // Scan Next Item
  const handleScanNext = () => {
    setFoundProduct(null);
    setScannedCode("");
    setManualCode("");
    setUpdateSuccess(null);
    setScannerError(null);
    startCamera(facingMode);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch((e) => console.error(e));
      }
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          ระบบตรวจเช็คครุภัณฑ์ด้วย QR Code
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          สแกนผ่านกล้องสมาร์ทโฟน / แท็บเล็ต หรือพิมพ์รหัสครุภัณฑ์เพื่อตรวจเช็คสถานะ
        </p>
      </div>

      {/* Main Scanner Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 sm:p-6 mb-6">
        {/* Scanner Viewfinder */}
        {!foundProduct && (
          <div>
            <div className="relative w-full max-w-sm mx-auto overflow-hidden rounded-2xl bg-gray-950 aspect-square flex flex-col items-center justify-center border-4 border-emerald-500 shadow-inner">
              <div id="qr-reader-container" className="w-full h-full" />

              {!isScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 text-white p-6 text-center z-10">
                  <QrCodeScannerIcon sx={{ fontSize: 64, color: "#10b981", mb: 2 }} />
                  <p className="font-semibold text-base mb-1">กล้องสแกน QR Code</p>
                  <p className="text-xs text-gray-400 mb-5">
                    กดปุ่มด้านล่างเพื่อเริ่มเปิดกล้องสแกน
                  </p>
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={() => startCamera()}
                    startIcon={<QrCodeScannerIcon />}
                    sx={{ fontWeight: "bold" }}
                  >
                    เปิดกล้องสแกน
                  </Button>
                </div>
              )}
            </div>

            {/* Camera Controls */}
            {isScanning && (
              <div className="flex justify-center items-center gap-3 mt-4">
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  onClick={toggleCamera}
                  startIcon={<CameraswitchIcon />}
                >
                  สลับกล้อง ({facingMode === "environment" ? "กล้องหลัง" : "กล้องหน้า"})
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={stopCamera}
                >
                  ปิดกล้อง
                </Button>
              </div>
            )}

            {/* Alternative Scan Options */}
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
              {/* File Upload Scan */}
              <div className="text-center">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  startIcon={<CloudUploadIcon />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  หรือเลือกรูปภาพ QR Code จากในเครื่อง
                </Button>
              </div>

              {/* Manual Code Form */}
              <form onSubmit={handleManualSearch} className="flex gap-2">
                <input
                  type="text"
                  placeholder="พิมพ์หมายเลขครุภัณฑ์ เช่น 7440-001-0001/65"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="input input-bordered input-accent w-full text-sm"
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  sx={{ minWidth: "90px" }}
                >
                  ค้นหา
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {loadingProduct && (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-emerald-600 mb-3"></div>
            <p className="text-sm font-medium text-gray-600">กำลังค้นหาข้อมูลครุภัณฑ์...</p>
          </div>
        )}

        {/* Error Notification */}
        {scannerError && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
            <ErrorOutlineIcon className="flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold">เกิดข้อผิดพลาด</p>
              <p>{scannerError}</p>
            </div>
          </div>
        )}

        {/* Found Product Card & Inspection Action */}
        {foundProduct && (
          <div className="space-y-6 animate-fadeIn">
            {/* Success Alert */}
            {updateSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl flex items-center gap-3">
                <CheckCircleIcon color="success" />
                <span className="text-sm font-medium">{updateSuccess}</span>
              </div>
            )}

            {/* Product Details Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              {foundProduct.image ? (
                <img
                  src={foundProduct.image}
                  alt={foundProduct.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl border border-gray-300"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold text-center p-2 text-xs">
                  ไม่มีรูปภาพ
                </div>
              )}

              <div className="flex-1 text-center sm:text-left space-y-1.5">
                <div className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded">
                  {foundProduct.num1}
                </div>
                <h2 className="text-lg font-bold text-gray-900">{foundProduct.name}</h2>
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">สถานที่:</span> {foundProduct.building || "-"} |{" "}
                  <span className="font-semibold">ผู้ดูแล:</span> {foundProduct.respondent || "-"}
                </p>
                <p className="text-xs text-gray-500">
                  <span className="font-semibold">ราคา:</span> {Number(foundProduct.price || 0).toLocaleString()} บาท |{" "}
                  <span className="font-semibold">จำนวน:</span> {foundProduct.num2 || 1}
                </p>
                {foundProduct.lastCheckedDate && (
                  <p className="text-xs text-blue-600 font-medium">
                    ตรวจเช็คล่าสุด: {foundProduct.lastCheckedDate}
                  </p>
                )}
              </div>
            </div>

            {/* Inspection Form */}
            <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-200 space-y-4">
              <h3 className="font-bold text-base text-emerald-900 flex items-center gap-2">
                <CheckCircleIcon fontSize="small" className="text-emerald-600" />
                ตรวจเช็คสภาพครุภัณฑ์
              </h3>

              {/* Status Radio / Select */}
              <div>
                <label className="label-text font-semibold text-gray-700 block mb-2 text-sm">
                  สถานะการตรวจเช็ค:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["ปกติ", "ชำรุด", "จำหน่าย", "สูญหาย"].map((st) => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setInspectStatus(st)}
                      className={`py-2 px-3 rounded-lg text-sm font-bold border transition ${
                        inspectStatus === st
                          ? st === "ปกติ"
                            ? "bg-emerald-600 text-white border-emerald-600 shadow"
                            : st === "ชำรุด"
                            ? "bg-amber-500 text-white border-amber-500 shadow"
                            : "bg-red-600 text-white border-red-600 shadow"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="label-text font-semibold text-gray-700 block mb-1 text-sm">
                  หมายเหตุ / สภาพครุภัณฑ์:
                </label>
                <textarea
                  value={inspectNote}
                  onChange={(e) => setInspectNote(e.target.value)}
                  rows={2}
                  className="textarea textarea-bordered textarea-accent w-full text-sm"
                  placeholder="เช่น สภาพสมบูรณ์พร้อมใช้งาน, อุปกรณ์มีรอยแตก, ส่งซ่อมฝ่ายพัสดุ ฯลฯ"
                />
              </div>

              {/* Save Button */}
              <Button
                variant="contained"
                color="success"
                size="large"
                fullWidth
                disabled={isUpdating}
                onClick={handleSaveInspection}
                startIcon={<SaveIcon />}
                sx={{ fontWeight: "bold" }}
              >
                {isUpdating ? "กำลังบันทึก..." : "บันทึกผลการตรวจเช็ค"}
              </Button>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                size="large"
                onClick={handleScanNext}
                startIcon={<RefreshIcon />}
                sx={{ fontWeight: "bold" }}
              >
                สแกนรายการถัดไป
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
