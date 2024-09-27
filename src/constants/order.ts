import type { Category } from "./category";
import type Merchant from "./merchant";
import type Product from "./product";

interface Order {
    product: Product,
    qty: number,
}

interface OrdersData {
    orders: Array<Order>,
    merchant: Merchant,
}

export type { Order, OrdersData }