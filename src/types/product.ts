export type ProductStatus = "ปกติ" | "ชำรุด" | "จำหน่าย" | "สูญหาย";

export interface IProduct {
  _id?: string;
  name: string;             // รายการครุภัณฑ์
  image?: string;            // URL รูปภาพ
  num1: string;              // หมายเลขครุภัณฑ์ (รองรับเช่น 7440-001-0001/65)
  price: number;             // ราคา
  num2: number;              // จำนวน
  spec: string;              // คุณลักษณะครุภัณฑ์
  date1: string;             // วันที่ได้มา (YYYY-MM-DD)
  date2: string;             // ปีที่จัดซื้อ (YYYY-MM-DD หรือ ปี พ.ศ./ค.ศ.)
  building: string;          // สถานที่ใช้งาน
  method: string;            // วิธีการจัดหา (สอบราคา, เฉพาะเจาะจง, e-bidding ฯลฯ)
  budget: string;            // งบประมาณ (งบประมาณแผ่นดิน, งบประมาณเงินรายได้ ฯลฯ)
  category: string;          // ประเภทครุภัณฑ์
  group: string;             // กลุ่มครุภัณฑ์ (ครุภัณฑ์ต่ำกว่าเกณฑ์, ครุภัณฑ์สูงกว่าเกณฑ์)
  stat: ProductStatus | string; // สถานะ
  respondent: string;        // ผู้รับผิดชอบ
  qrcode: string;            // QR Code / หมายเลขประจำตัว
  lastCheckedDate?: string;  // วันที่ตรวจเช็คล่าสุด
  checkNote?: string;        // บันทึกผลการตรวจเช็ค
  createdAt?: string;
  updatedAt?: string;
}

export interface IProductFormData {
  name: string;
  image: string;
  num1: string;
  price: string | number;
  num2: string | number;
  spec: string;
  date1: string;
  date2: string;
  building: string;
  method: string;
  budget: string;
  category: string;
  group: string;
  stat: string;
  respondent: string;
  qrcode: string;
  lastCheckedDate?: string;
  checkNote?: string;
}
