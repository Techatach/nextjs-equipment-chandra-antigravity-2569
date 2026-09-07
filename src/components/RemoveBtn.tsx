"use client";

import React, { useState } from "react";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";

interface RemoveBtnProps {
  id: string;
  name?: string;
  onDeleted?: () => void;
}

export default function RemoveBtn({ id, name, onDeleted }: RemoveBtnProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const removeProduct = async () => {
    const itemName = name ? ` "${name}"` : "";
    const confirmed = window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบรายการครุภัณฑ์${itemName}?`);

    if (confirmed) {
      setIsDeleting(true);
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "เกิดข้อผิดพลาดในการลบรายการ");
        }

        if (onDeleted) {
          onDeleted();
        } else {
          router.refresh();
        }
      } catch (error: any) {
        alert(error.message || "ไม่สามารถลบรายการได้");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Button
      variant="contained"
      onClick={removeProduct}
      color="error"
      size="small"
      disabled={isDeleting}
      title="ลบรายการ"
      sx={{ minWidth: "36px", padding: "6px" }}
    >
      {isDeleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon fontSize="small" />}
    </Button>
  );
}
