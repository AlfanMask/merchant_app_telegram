import type { Category } from "./category";

export default interface Product {
    id: string,
    merchant_id: string,
    category: Category,
    subcategory: Category|string,
    title: string,
    description?: string,
    price: number,
    is_popular?: boolean,
}