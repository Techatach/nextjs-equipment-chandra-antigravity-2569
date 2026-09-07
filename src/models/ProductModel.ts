import mongoose, { Schema, Document, Model } from "mongoose";
import { IProduct } from "@/types/product";

export interface IProductDocument extends Omit<IProduct, "_id">, Document {}

const productSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: [true, "กรุณากรอกรายการครุภัณฑ์"] },
    image: { type: String, default: "" },
    num1: { type: String, required: [true, "กรุณากรอกหมายเลขครุภัณฑ์"], trim: true },
    price: { type: Number, default: 0 },
    num2: { type: Number, default: 1 },
    spec: { type: String, default: "" },
    date1: { type: String, default: "" },
    date2: { type: String, default: "" },
    building: { type: String, default: "" },
    method: { type: String, default: "" },
    budget: { type: String, default: "" },
    category: { type: String, default: "" },
    group: { type: String, default: "" },
    stat: { type: String, default: "ปกติ" },
    respondent: { type: String, default: "" },
    qrcode: { type: String, default: "" },
    lastCheckedDate: { type: String, default: "" },
    checkNote: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

// สร้าง Index สำหรับค้นหาได้อย่างรวดเร็ว
productSchema.index({ num1: 1 });
productSchema.index({ qrcode: 1 });
productSchema.index({ name: "text", building: "text" });

const ProductModel: Model<IProductDocument> =
  mongoose.models.Product || mongoose.model<IProductDocument>("Product", productSchema);

export default ProductModel;
