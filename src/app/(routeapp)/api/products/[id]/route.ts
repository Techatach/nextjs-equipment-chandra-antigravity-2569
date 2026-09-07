import connectMongoDB from "@/lib/Mongodb";
import ProductModel from "@/models/ProductModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    await connectMongoDB();
    const { id } = params;
    const decodedId = decodeURIComponent(id);

    let product = null;

    if (mongoose.Types.ObjectId.isValid(decodedId)) {
      product = await ProductModel.findById(decodedId).lean();
    }

    if (!product) {
      product = await ProductModel.findOne({
        $or: [{ qrcode: decodedId }, { num1: decodedId }, { name: decodedId }],
      }).lean();
    }

    if (!product) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลครุภัณฑ์" },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await connectMongoDB();
    const { id } = params;
    const decodedId = decodeURIComponent(id);
    const body = await request.json();

    // Support both prefixed new... (from old EditProductForm) and standard keys
    const updateData: Record<string, any> = {};

    if (body.name !== undefined || body.newName !== undefined) {
      updateData.name = body.name ?? body.newName;
    }
    if (body.image !== undefined || body.newImage !== undefined) {
      updateData.image = body.image ?? body.newImage;
    }
    if (body.num1 !== undefined || body.newNum1 !== undefined) {
      updateData.num1 = String(body.num1 ?? body.newNum1).trim();
    }
    if (body.price !== undefined || body.newPrice !== undefined) {
      updateData.price = Number(body.price ?? body.newPrice);
    }
    if (body.num2 !== undefined || body.newNum2 !== undefined) {
      updateData.num2 = Number(body.num2 ?? body.newNum2);
    }
    if (body.spec !== undefined || body.newSpec !== undefined) {
      updateData.spec = body.spec ?? body.newSpec;
    }
    if (body.date1 !== undefined || body.newDate1 !== undefined) {
      updateData.date1 = body.date1 ?? body.newDate1;
    }
    if (body.date2 !== undefined || body.newDate2 !== undefined) {
      updateData.date2 = body.date2 ?? body.newDate2;
    }
    if (body.building !== undefined || body.newBuilding !== undefined) {
      updateData.building = body.building ?? body.newBuilding;
    }
    if (body.method !== undefined || body.newMethod !== undefined) {
      updateData.method = body.method ?? body.newMethod;
    }
    if (body.budget !== undefined || body.newBudget !== undefined) {
      updateData.budget = body.budget ?? body.newBudget;
    }
    if (body.category !== undefined || body.newCategory !== undefined) {
      updateData.category = body.category ?? body.newCategory;
    }
    if (body.group !== undefined || body.newGroup !== undefined) {
      updateData.group = body.group ?? body.newGroup;
    }
    if (body.stat !== undefined || body.state !== undefined || body.newState !== undefined) {
      updateData.stat = body.stat ?? body.state ?? body.newState;
    }
    if (body.respondent !== undefined || body.newRespondent !== undefined) {
      updateData.respondent = body.respondent ?? body.newRespondent;
    }
    if (body.qrcode !== undefined || body.newQrcode !== undefined) {
      updateData.qrcode = body.qrcode ?? body.newQrcode;
    }
    if (body.lastCheckedDate !== undefined) {
      updateData.lastCheckedDate = body.lastCheckedDate;
    }
    if (body.checkNote !== undefined) {
      updateData.checkNote = body.checkNote;
    }

    let updatedProduct = null;
    if (mongoose.Types.ObjectId.isValid(decodedId)) {
      updatedProduct = await ProductModel.findByIdAndUpdate(
        decodedId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).lean();
    }

    if (!updatedProduct) {
      updatedProduct = await ProductModel.findOneAndUpdate(
        { $or: [{ qrcode: decodedId }, { num1: decodedId }, { name: decodedId }] },
        { $set: updateData },
        { new: true, runValidators: true }
      ).lean();
    }

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "ไม่พบครุภัณฑ์ที่ต้องการแก้ไข" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/products/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, context: RouteParams) {
  return PUT(request, context);
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    await connectMongoDB();
    const { id } = params;
    const decodedId = decodeURIComponent(id);

    let deleted = null;
    if (mongoose.Types.ObjectId.isValid(decodedId)) {
      deleted = await ProductModel.findByIdAndDelete(decodedId);
    }

    if (!deleted) {
      deleted = await ProductModel.findOneAndDelete({
        $or: [{ qrcode: decodedId }, { num1: decodedId }, { name: decodedId }],
      });
    }

    if (!deleted) {
      return NextResponse.json(
        { error: "ไม่พบครุภัณฑ์ที่ต้องการลบ" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "ลบครุภัณฑ์เรียบร้อยแล้ว", id: decodedId },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
