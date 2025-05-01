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
  stockHistory?: { date: string; quantity: number }[];
  cost?: number;
  supplier?: string;
  reorderPoint?: number;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  quantity?: number;
};
