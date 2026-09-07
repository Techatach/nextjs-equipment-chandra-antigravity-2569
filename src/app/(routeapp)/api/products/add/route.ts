import { POST as createProduct } from "../route";

export async function POST(request: Request) {
  return createProduct(request);
}
