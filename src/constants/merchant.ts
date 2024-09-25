import type { Category } from "./category";

export default interface Merchant {
    id: string,
    title: string,
    category: Category,
    is_parking_free: boolean,
    gmap_url: string,
}