export interface SingleOrder {
  productId: number | null;
  quantity: number;
  shippingDetailsId: number | null;
}

export interface Order {
  orderId: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  shippingDetailsId: number;
}