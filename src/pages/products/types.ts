export type ProductType = {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  threshold: number;
  status: string;
  description?: string;
};
