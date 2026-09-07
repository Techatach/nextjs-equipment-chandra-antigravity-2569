import connectMongoDB from "@/lib/Mongodb";
import ProductModel from "@/models/ProductModel";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();
    const stat = searchParams.get("stat")?.trim();

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { num1: { $regex: search, $options: "i" } },
        { building: { $regex: search, $options: "i" } },
        { respondent: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { qrcode: { $regex: search, $options: "i" } },
      ];
    }

    if (stat) {
      filter.stat = stat;
    }

    const products = await ProductModel.find(filter).sort({ createdAt: -1 }).lean();

    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      image,
      num1,
      price,
      num2,
      spec,
      date1,
      date2,
      building,
      method,
      budget,
      category,
      group,
      stat,
      state,
      respondent,
      qrcode,
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "กรุณาระบุรายการครุภัณฑ์" },
        { status: 400 }
      );
    }

    if (!num1 || !String(num1).trim()) {
      return NextResponse.json(
        { error: "กรุณาระบุหมายเลขครุภัณฑ์" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const cleanedNum1 = String(num1).trim();
    const cleanedQrcode = qrcode && String(qrcode).trim() ? String(qrcode).trim() : cleanedNum1;
    const finalStat = stat || state || "ปกติ";

    const newProduct = await ProductModel.create({
      name: name.trim(),
      image: image || "",
      num1: cleanedNum1,
      price: price ? Number(price) : 0,
      num2: num2 ? Number(num2) : 1,
      spec: spec || "",
      date1: date1 || "",
      date2: date2 || "",
      building: building || "",
      method: method || "",
      budget: budget || "",
      category: category || "",
      group: group || "",
      stat: finalStat,
      respondent: respondent || "",
      qrcode: cleanedQrcode,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json(
        { error: "กรุณาระบุ ID ครุภัณฑ์ที่ต้องการลบ" },
        { status: 400 }
      );
    }

    const deleted = await ProductModel.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "ไม่พบครุภัณฑ์ที่ต้องการลบ" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "ลบครุภัณฑ์เรียบร้อยแล้ว", id },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE /api/products error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
