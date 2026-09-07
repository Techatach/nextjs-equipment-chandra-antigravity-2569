"use client";

import React, { useState } from "react";
import Loading from "@/app/loading";
import Title from "@/components/Title";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import { useRouter } from "next/navigation";
import { IProductFormData } from "@/types/product";
import { createProduct } from "@/lib/productAction";

export default function AddProductForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<IProductFormData>({
    name: "",
    image: "",
    num1: "",
    price: "",
    num2: "1",
    spec: "",
    date1: "",
    date2: "",
    building: "",
    method: "เฉพาะเจาะจง",
    budget: "งบประมาณแผ่นดิน",
    category: "",
    group: "ครุภัณฑ์ต่ำกว่าเกณฑ์",
    stat: "ปกติ",
    respondent: "",
    qrcode: "",
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string | null; isError: boolean }>({
    text: null,
    isError: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // หากยังไม่ได้กรอก qrcode ให้ผูกกับ num1 โดยอัตโนมัติ
      if (name === "num1" && (!prev.qrcode || prev.qrcode === prev.num1)) {
        updated.qrcode = value;
      }
      return updated;
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("ขนาดไฟล์รูปภาพต้องไม่เกิน 2MB");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      setFormData((prev) => ({ ...prev, image: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const clearForm = () => {
    setFormData({
      name: "",
      image: "",
      num1: "",
      price: "",
      num2: "1",
      spec: "",
      date1: "",
      date2: "",
      building: "",
      method: "เฉพาะเจาะจง",
      budget: "งบประมาณแผ่นดิน",
      category: "",
      group: "ครุภัณฑ์ต่ำกว่าเกณฑ์",
      stat: "ปกติ",
      respondent: "",
      qrcode: "",
    });
    setImagePreview("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage({ text: null, isError: false });

    try {
      await createProduct(formData);
      setMessage({
        text: "บันทึกรายการครุภัณฑ์สำเร็จเรียบร้อยแล้ว!",
        isError: false,
      });
      clearForm();
      setTimeout(() => {
        router.push("/productlist");
      }, 1200);
    } catch (error: any) {
      setMessage({
        text: error.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-10 border border-gray-100">
        <Title text="แบบฟอร์มกรอกรายการครุภัณฑ์" />
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
                value={formData.name}
                onChange={handleChange}
                required
                className="input input-bordered input-accent w-full"
                type="text"
                placeholder="เช่น เครื่องคอมพิวเตอร์แบบตั้งโต๊ะ All-in-One"
              />
            </div>

            {/* หมายเลขครุภัณฑ์ */}
            <div>
              <label className="label-text font-semibold text-gray-700 block mb-1">
                หมายเลขครุภัณฑ์ <span className="text-red-500">*</span>
              </label>
              <input
                name="num1"
                value={formData.num1}
                onChange={handleChange}
                required
                className="input input-bordered input-accent w-full"
                type="text"
                placeholder="เช่น 7440-001-0001/65"
              />
            </div>

            {/* ราคา */}
            <div>
              <label className="label-text font-semibold text-gray-700 block mb-1">
                ราคาต่อหน่วย (บาท)
              </label>
              <input
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="input input-bordered input-accent w-full"
                type="number"
                min="0"
                step="0.01"
                placeholder="เช่น 25000"
              />
            </div>

            {/* จำนวน */}
            <div>
              <label className="label-text font-semibold text-gray-700 block mb-1">
                จำนวน
              </label>
              <input
                name="num2"
                value={formData.num2}
                onChange={handleChange}
                className="input input-bordered input-accent w-full"
                type="number"
                min="1"
                placeholder="1"
              />
            </div>

            {/* ภาพครุภัณฑ์ */}
            <div>
              <label className="label-text font-semibold text-gray-700 block mb-1">
                รูปภาพครุภัณฑ์
              </label>
              <div className="flex items-center gap-3">
                {/* Preview */}
                <div className="w-16 h-16 flex-shrink-0 rounded-lg border border-dashed border-gray-300 bg-gray-50 overflow-hidden flex items-center justify-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-[10px] text-center px-1">ไม่มีรูป</span>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input file-input-bordered file-input-accent file-input-sm w-full"
                  />
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP ขนาดไม่เกิน 2MB</p>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview("");
                        setFormData((prev) => ({ ...prev, image: "" }));
                      }}
                      className="text-xs text-red-500 hover:underline mt-0.5"
                    >
                      ลบรูปภาพ
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* สถานที่ใช้งาน */}
            <div>
              <label className="label-text font-semibold text-gray-700 block mb-1">
                สถานที่ใช้งาน / ห้อง
              </label>
              <input
                name="building"
                value={formData.building}
                onChange={handleChange}
                className="input input-bordered input-accent w-full"
                type="text"
                placeholder="เช่น อาคาร 2 ห้อง 205"
              />
            </div>

            {/* ผู้รับผิดชอบ */}
            <div>
              <label className="label-text font-semibold text-gray-700 block mb-1">
                ผู้รับผิดชอบ / ผู้ดูแล
              </label>
              <input
                name="respondent"
                value={formData.respondent}
                onChange={handleChange}
                className="input input-bordered input-accent w-full"
                type="text"
                placeholder="เช่น อาจารย์สมชาย ใจดี"
              />
            </div>

            {/* วันที่ได้มา */}
            <div>
              <label className="label-text font-semibold text-gray-700 block mb-1">
                วันที่ได้มา
              </label>
              <input
                name="date1"
                value={formData.date1}
                onChange={handleChange}
                className="input input-bordered input-accent w-full"
                type="date"
              />
            </div>

            {/* ปีที่จัดซื้อ */}
            <div>
              <label className="label-text font-semibold text-gray-700 block mb-1">
                ปีที่จัดซื้อ (พ.ศ. / ค.ศ.)
              </label>
              <input
                name="date2"
                value={formData.date2}
                onChange={handleChange}
                className="input input-bordered input-accent w-full"
                type="text"
                placeholder="เช่น 2566"
              />
            </div>

            {/* วิธีการจัดหา */}
            <div>
              <label className="label-text font-semibold text-gray-700 block mb-1">
                วิธีการจัดหา
              </label>
              <select
                name="method"
                value={formData.method}
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
                value={formData.budget}
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
                value={formData.category}
                onChange={handleChange}
                className="input input-bordered input-accent w-full"
                type="text"
                placeholder="เช่น ครุภัณฑ์คอมพิวเตอร์, สำนักงาน"
              />
            </div>

            {/* กลุ่มครุภัณฑ์ */}
            <div>
              <label className="label-text font-semibold text-gray-700 block mb-1">
                กลุ่มครุภัณฑ์
              </label>
              <select
                name="group"
                value={formData.group}
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
                value={formData.stat}
                onChange={handleChange}
                className="select select-bordered select-accent w-full"
              >
                <option value="ปกติ">ปกติ</option>
                <option value="ชำรุด">ชำรุด</option>
                <option value="จำหน่าย">จำหน่าย</option>
                <option value="สูญหาย">สูญหาย</option>
              </select>
            </div>

            {/* QR Code / รหัสสแกน */}
            <div>
              <label className="label-text font-semibold text-gray-700 block mb-1">
                รหัส QR Code (ค่าเริ่มต้นจะใช้หมายเลขครุภัณฑ์)
              </label>
              <input
                name="qrcode"
                value={formData.qrcode}
                onChange={handleChange}
                className="input input-bordered input-accent w-full"
                type="text"
                placeholder="เว้นว่างไว้เพื่อใช้หมายเลขครุภัณฑ์"
              />
            </div>

            {/* คุณลักษณะครุภัณฑ์ */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="label-text font-semibold text-gray-700 block mb-1">
                คุณลักษณะครุภัณฑ์ / สเปค
              </label>
              <textarea
                name="spec"
                value={formData.spec}
                onChange={handleChange}
                rows={3}
                className="textarea textarea-bordered textarea-accent w-full"
                placeholder="ระบุรายละเอียดทางเทคนิค เช่น CPU Intel Core i7, RAM 16GB, SSD 512GB"
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
              className="w-full sm:w-64 font-bold text-base shadow-lg"
            >
              บันทึกรายการครุภัณฑ์
            </Button>
            <Button
              variant="outlined"
              type="button"
              size="large"
              color="inherit"
              onClick={clearForm}
              className="w-full sm:w-40"
            >
              ล้างข้อมูล
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
