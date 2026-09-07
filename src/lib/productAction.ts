import useSWR from "swr";
import { IProduct, IProductFormData } from "@/types/product";

const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Failed to fetch data from API");
  }
  return res.json();
};

export function useAllProducts(query: string = "") {
  const url = query ? `/api/products?search=${encodeURIComponent(query)}` : "/api/products";
  const { data, error, isLoading, isValidating, mutate } = useSWR<IProduct[]>(url, fetcher);
  return { products: data || [], isLoading, isValidating, mutate, error };
}

export function useProductById(id: string | undefined | null) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<IProduct>(
    id ? `/api/products/${id}` : null,
    fetcher
  );
  return { product: data, isLoading, isValidating, mutate, error };
}

export async function createProduct(formData: IProductFormData): Promise<IProduct> {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || "บันทึกข้อมูลครุภัณฑ์ไม่สำเร็จ");
  }
  return data;
}

export async function updateProduct(id: string, updateData: Partial<IProduct>): Promise<IProduct> {
  const res = await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || "แก้ไขข้อมูลครุภัณฑ์ไม่สำเร็จ");
  }
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`/api/products/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || data.message || "ลบข้อมูลครุภัณฑ์ไม่สำเร็จ");
  }
}

export async function getProductByCode(code: string): Promise<IProduct> {
  const res = await fetch(`/api/products/${encodeURIComponent(code)}`, {
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || "ไม่พบข้อมูลครุภัณฑ์");
  }
  return data;
}
