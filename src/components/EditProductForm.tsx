"use client";

import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import Title from "./Title";
import { IProduct } from "@/types/product";
import Link from "next/link";
import { updateProduct } from "@/lib/productAction";

interface EditProductFormProps {
  id: string;
  initialData?: IProduct;
}

export default function EditProductForm({ id, initialData }: EditProductFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<IProduct>>(initialData || {});
  const [isLoading, setIsLoading] = useState(!initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string | null; isError: boolean }>({
    text: null,
    isError: false,
  });

  useEffect(() => {
    if (!initialData && id) {
      setIsLoading(true);
      fetch(`/api/products/${id}`, { cache: "no-store" })
        .then((res) => {
          if (!res.ok) throw new Error("ไม่สามารถโหลดข้อมูลครุภัณฑ์ได้");
          return res.json();
        })
        .then((data) => {
          setFormData(data);
        })
        .catch((err) => {
          setMessage({ text: err.message, isError: true });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id, initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: null, isError: false });

    try {
      await updateProduct(id, formData);
      setMessage({
        text: "แก้ไขข้อมูลครุภัณฑ์เรียบร้อยแล้ว!",
        isError: false,
      });
      setTimeout(() => {
        router.push("/productlist");
        router.refresh();
      }, 1000);
    } catch (error: any) {
      setMessage({
        text: error.message || "เกิดข้อผิดพลาดในการแก้ไขข้อมูล",
        isError: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-10 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <Link href="/productlist">
            <Button startIcon={<ArrowBackIcon />} variant="text" color="inherit">
              กลับสู่รายการ
            </Button>
          </Link>
          <span className="text-xs font-mono bg-gray-100 px-3 py-1 rounded-full text-gray-600">
            ID: {id}
          </span>
        </div>

        <Title text="แบบฟอร์มแก้ไขข้อมูลครุภัณฑ์" />
        <p className="text-center text-sm text-gray-500 mb-8">
          คณะมนุษยศาสตร์และสังคมศาสตร์ มหาวิทยาลัยราชภัฏจันทรเกษม
        </p>

        {message.text && (
          <div
            className={`text-center w-full max-w-xl mx-auto mb-6 p-4 rounded-xl font-medium shadow-sm transition ${
              message.isError
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* รายการครุภัณฑ์ */}
            <div className="sm:col-span-2">
              <label className="label-text font-semibold text-gray-700 block mb-1">
                รายการครุภัณฑ์ <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                required
                className="input input-bordered input-accent w-full"
                type="text"
              />
            </div>

            {/* หมายเลขครุภัณฑ์ */}
            <div>
              <label className="label-text font-semibold text-gray-700 block mb-1">
                หมายเลขครุภัณฑ์ <span className="text-red-500">*</span>
              </label>
              <input
                name="num1"
                value={formData.num1 || ""}
                onChange={handleChange}
                required
                className="input input-bordered input-accent w-full"
                type="text"
              />
            </div>

            {/* ราคา */}
            <div>
              <label className="label-text font-semibold text-gray-700 block mb-1">
                ราคาต่อหน่วย (บาท)
              </label>
              <input
                name="price"
                value={formData.price ?? ""}
                onChange={handleChange}
                className="input input-bordered input-accent w-full"
                type="number"
                min="0"
                step="0.01"
              />
            </div>

            {/* จำนวน */}
            <div>
              <label className="label-text font-semibold text-gray-700 block mb-1">
                จำนวน
              </label>
              <input
                name="num2"
                value={formData.num2 ?? "1"}
                onChange={handleChange}
                className="input input-bordered input-accent w-full"
                type="number"
                min="1"
              />
            </div>

            {/* ภาพครุภัณฑ์ */}
            <div>
              <label className="label-text font-semibold text-gray-700 block mb-1">
                URL รูปภาพ
              </label>
              <input
                name="image"
                value={formData.image || ""}
                onChange={handleChange}
                className="input input-bordered input-accent w-full"
                type="text"
              />
            </div>

            {/* สถานที่ใช้งาน */}
            <div>
              <label className="label-text font-semibold text-gray-700 block mb-1">
                สถานที่ใช้งาน / ห้อง
              </label>
              <input
                name="building"
                value={formData.building || ""}
                onChange={handleChange}
                className="input input-bordered input-accent w-full"
                type="text"
              />
            </div>

            {/* ผู้รับผิดชอบ */}
            <div>
              <label className="label-text font-semibold text-gray-700 block mb-1">
                ผู้รับผิดชอบ / ผู้ดูแล
              </label>
              <input
                name="respondent"
                value={formData.respondent || ""}
                onChange={handleChange}
                className="input input-bordered input-accent w-full"
                type="text"
              />
            </div>

            {/* วันที่ได้มา */}
            <div>
              <label className="label-text font-semibold text-gray-700 block mb-1">
                วันที่ได้มา
              </label>
              <input
                name="date1"
                value={formData.date1 || ""}
                onChange={handleChange}
                className="input input-bordered input-accent w-full"
                type="date"
              />
            </div>

            {/* ปีที่จัดซื้อ */}
            <div>
              <label className="label-text font-semibold text-gray-700 block mb-1">
                ปีที่จัดซื้อ
              </label>
              <input
                name="date2"
                value={formData.date2 || ""}
                onChange={handleChange}
                className="input input-bordered input-accent w-full"
                type="text"
              />
            </div>

            {/* วิธีการจัดหา */}
            <div>
              <label className="label-text font-semibold text-gray-700 block mb-1">
                วิธีการจัดหา
              </label>
              <select
                name="method"
                value={formData.method || "เฉพาะเจาะจง"}
                onChange={handleChange}
                className="select select-bordered select-accent w-full"
              >
                <option value="เฉพาะเจาะจง">เฉพาะเจาะจง</option>
                <option value="สอบราคา">สอบราคา</option>
                <option value="e-bidding">e-bidding</option>
                <option value="รับบริจาค">รับบริจาค</option>
              </select>
            </div>

            {/* งบประมาณ */}
            <div>
              <label className="label-text font-semibold text-gray-700 block mb-1">
                งบประมาณ
              </label>
              <select
                name="budget"
                value={formData.budget || "งบประมาณแผ่นดิน"}
                onChange={handleChange}
                className="select select-bordered select-accent w-full"
              >
                <option value="งบประมาณแผ่นดิน">งบประมาณแผ่นดิน</option>
                <option value="งบประมาณเงินรายได้">งบประมาณเงินรายได้</option>
                <option value="งบประมาณอื่นๆ">งบประมาณอื่นๆ</option>
              </select>
            </div>

            {/* ประเภทครุภัณฑ์ */}
            <div>
              <label className="label-text font-semibold text-gray-700 block mb-1">
                ประเภทครุภัณฑ์
              </label>
              <input
                name="category"
                value={formData.category || ""}
                onChange={handleChange}
                className="input input-bordered input-accent w-full"
                type="text"
              />
            </div>

            {/* กลุ่มครุภัณฑ์ */}
            <div>
              <label className="label-text font-semibold text-gray-700 block mb-1">
                กลุ่มครุภัณฑ์
              </label>
              <select
                name="group"
                value={formData.group || "ครุภัณฑ์ต่ำกว่าเกณฑ์"}
                onChange={handleChange}
                className="select select-bordered select-accent w-full"
              >
                <option value="ครุภัณฑ์ต่ำกว่าเกณฑ์">ครุภัณฑ์ต่ำกว่าเกณฑ์</option>
                <option value="ครุภัณฑ์สูงกว่าเกณฑ์">ครุภัณฑ์สูงกว่าเกณฑ์</option>
              </select>
            </div>

            {/* สถานะ */}
            <div>
              <label className="label-text font-semibold text-gray-700 block mb-1">
                สถานะ
              </label>
              <select
                name="stat"
                value={formData.stat || "ปกติ"}
                onChange={handleChange}
                className="select select-bordered select-accent w-full"
              >
                <option value="ปกติ">ปกติ</option>
                <option value="ชำรุด">ชำรุด</option>
                <option value="จำหน่าย">จำหน่าย</option>
                <option value="สูญหาย">สูญหาย</option>
              </select>
            </div>

            {/* QR Code */}
            <div>
              <label className="label-text font-semibold text-gray-700 block mb-1">
                รหัส QR Code
              </label>
              <input
                name="qrcode"
                value={formData.qrcode || ""}
                onChange={handleChange}
                className="input input-bordered input-accent w-full"
                type="text"
              />
            </div>

            {/* คุณลักษณะครุภัณฑ์ */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="label-text font-semibold text-gray-700 block mb-1">
                คุณลักษณะครุภัณฑ์ / สเปค
              </label>
              <textarea
                name="spec"
                value={formData.spec || ""}
                onChange={handleChange}
                rows={3}
                className="textarea textarea-bordered textarea-accent w-full"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 border-t">
            <Button
              variant="contained"
              type="submit"
              size="large"
              color="success"
              startIcon={<SaveIcon />}
              disabled={isSaving}
              className="w-full sm:w-64 font-bold text-base shadow-lg"
            >
              {isSaving ? "กำลังบันทึก..." : "บันทึกการแก้ไขครุภัณฑ์"}
            </Button>
            <Link href="/productlist" passHref>
              <Button
                variant="outlined"
                type="button"
                size="large"
                color="inherit"
                className="w-full sm:w-40"
              >
                ยกเลิก
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
