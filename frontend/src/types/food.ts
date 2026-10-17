export interface FoodItem {
  id: number;
  name: string;
  price: number;
  category: string;
  vegetarian?: boolean;
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
  selectedAddOns?: CustomizationOption[];
  cartItemId?: string;
}

export type Category =
  | 'All'
  | 'Burger'
  | 'Pizza'
  | 'Sandwiches & Wraps'
  | 'Snacks & Sides'
  | 'Pasta'
  | 'Indian Meals'
  | 'Beverage'
  | 'Dessert';

// ─── Order types (mirrors backend DTOs exactly) ───────────────────────────────

/** Fields sent per line-item in POST /api/orders */
export interface OrderItemRequest {
  category: string;
  name: string;
  quantity: number;
  addOns?: string[];
}

/** Full POST /api/orders request body */
export interface PlaceOrderRequest {
  items: OrderItemRequest[];
  address?: string;
  specialInstructions?: string;
  deliveryOption: string;
  paymentOption: string;
  /** "NONE" | "PERCENTAGE:10" | "FIXED:50" */
  discountStrategy: string;
  customerEmail?: string;
}

/** Single line-item in a response */
export interface OrderItemResponse {
  foodName: string;
  foodCategory: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  customizations?: string[];
}

/** Response from POST /api/orders */
export interface PlaceOrderResponse {
  orderId: number;
  success: boolean;
  message: string;
  finalPrice: number;
  status: string;
  transactionId: string | null;
  address: string | null;
  deliveryOption: string | null;
  paymentOption: string | null;
  items: OrderItemResponse[];
  customerEmail?: string | null;
}

/** Response from GET /api/orders/{id} */
export interface OrderResponse {
  id: number;
  address: string | null;
  specialInstructions: string | null;
  deliveryOption: string | null;
  paymentOption: string | null;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItemResponse[];
  customerEmail?: string | null;
}

/** Valid order statuses — matches backend OrderStatus enum */
export type OrderStatus =
  | 'PLACED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export const ORDER_STATUSES: OrderStatus[] = [
  'PLACED',
  'PREPARING',
  'READY',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

/** Checkout form state (managed locally before submission) */
export interface CheckoutForm {
  deliveryOption: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
  paymentOption: 'CARD' | 'CASH' | 'UPI' | 'FAIL';
  discountStrategy: 'NONE' | 'PERCENTAGE:10' | 'FIXED:50';
  address: string;
  specialInstructions: string;
}
