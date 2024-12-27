import { writable } from "svelte/store";
import merchantsData from "../data/merchants.json";
import productsData from "../data/products.json";
import type Merchant from "../constants/merchant";
import type Product from "../constants/product";
import { Category } from "../constants/category";
import { Parking } from "../constants/parking";
import { Open } from "../constants/open";
import type { Order } from "../constants/order";

export const fromKampuskuApp = writable<string|null>(null)

// sort merchantsData by num_orders
const sortedMerchantsData = merchantsData.sort((a, b) => (b.num_orders as number) - (a.num_orders as number));

// get data from json
export const merchants = writable<Array<Merchant>>([]);
merchants.set(sortedMerchantsData as Array<Merchant>);

export const products = writable<Array<Product>>([]);
products.set(productsData as Array<Product>);

// merchants filter
export const filterMerchantsCategory = writable<Category>();
filterMerchantsCategory.set(Category.Semua)
export const filterMerchantsFreeParking = writable<Parking>();
filterMerchantsFreeParking.set(Parking.Semua)
export const filterMerchantsOpen = writable<Open>();
filterMerchantsOpen.set(Open.Semua)

// orders data
export const orders = writable<Array<Order>>([]);
orders.set([])

// pageNumber pagination
export const lastPageNumber = writable<number>(0)
lastPageNumber.set(0)