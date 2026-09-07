"use client";

import React from "react";
import RemoveBtn from "./RemoveBtn";
import { IProduct } from "@/types/product";

interface DeleteProductButtonProps {
  product: IProduct;
  refreshProducts?: () => void;
}

export default function DeleteProductButton({
  product,
  refreshProducts,
}: DeleteProductButtonProps) {
  if (!product._id) return null;

  return (
    <RemoveBtn
      id={product._id}
      name={product.name}
      onDeleted={refreshProducts}
    />
  );
}
