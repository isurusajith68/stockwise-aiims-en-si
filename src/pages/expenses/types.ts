export type Expense = {
  id: number;
  date: string;
  category: string;
  amount: number;
  description?: string;
  paymentMethod?: string;
};
