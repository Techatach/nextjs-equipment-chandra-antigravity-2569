import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[50vh] mx-auto py-12">
      <div className="h-12 w-12 animate-spin rounded-full border-emerald-600 border-t-4 border-l-4 border-r-transparent border-b-transparent"></div>
      <p className="text-sm font-medium text-gray-500 mt-4">กำลังโหลดข้อมูล...</p>
    </div>
  );
}
