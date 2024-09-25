import type { Category } from "./category";
import type Product from "./product";

interface Order {
    product: Product,
    qty: number,
}

interface OrdersData {
    orders: Array<Order>,
    merchant_name: string,
    is_parking_free: boolean,
    total_price: number,
}

export type { Order, OrdersData }