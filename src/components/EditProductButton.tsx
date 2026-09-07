"use client";

import React from "react";
import Link from "next/link";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";

interface EditProductButtonProps {
  id: string;
}

export default function EditProductButton({ id }: EditProductButtonProps) {
  return (
    <Link href={`/editProduct/${id}`} passHref>
      <Button
        variant="contained"
        color="success"
        size="small"
        title="แก้ไขข้อมูล"
        sx={{ minWidth: "36px", padding: "6px" }}
      >
        <EditIcon fontSize="small" />
      </Button>
    </Link>
  );
}
