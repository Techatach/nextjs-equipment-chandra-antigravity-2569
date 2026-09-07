"use client";

import React, { useState } from "react";
import EditProductButton from "./EditProductButton";
import DeleteProductButton from "./DeleteProductButton";
import { IProduct } from "@/types/product";
import Button from "@mui/material/Button";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import QRCodeModal from "./QRCodeModal";

interface ProductItemProps {
  data: IProduct;
  refreshProducts?: () => void;
}

export default function ProductItem({ data, refreshProducts }: ProductItemProps) {
  const [showQR, setShowQR] = useState(false);

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

  return (
    <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {data.num1 || "-"}
          </span>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getStatusBadge(
              data.stat || "ปกติ"
            )}`}
          >
            {data.stat || "ปกติ"}
          </span>
        </div>

        <h3 className="font-bold text-base text-gray-900 mb-2 line-clamp-2" title={data.name}>
          {data.name}
        </h3>

        <div className="space-y-1 text-xs text-gray-600 mb-3">
          <div className="flex justify-between">
            <span className="text-gray-400">สถานที่:</span>
            <span className="font-medium text-gray-700">{data.building || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">ราคา:</span>
            <span className="font-medium text-gray-700">
              {Number(data.price || 0).toLocaleString()} บาท
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">ผู้รับผิดชอบ:</span>
            <span className="font-medium text-gray-700">{data.respondent || "-"}</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-1">
        <Button
          variant="outlined"
          color="info"
          size="small"
          onClick={() => setShowQR(true)}
          sx={{ minWidth: "36px", padding: "6px" }}
          title="ดู QR Code"
        >
          <QrCode2Icon fontSize="small" />
        </Button>
        <div className="flex gap-1">
          {data._id && <EditProductButton id={data._id} />}
          <DeleteProductButton product={data} refreshProducts={refreshProducts} />
        </div>
      </div>

      {showQR && <QRCodeModal product={data} onClose={() => setShowQR(false)} />}
    </div>
  );
}
