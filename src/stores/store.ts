import { writable } from "svelte/store";
import merchantsData from "../data/merchants.json";
import productsData from "../data/products.json";
import type Merchant from "../constants/merchant";
import type Product from "../constants/product";
import { Category } from "../constants/category";
import { Parking } from "../constants/parking";
import { Open } from "../constants/open";

// get data from json
export const merchants = writable<Array<Merchant>>([]);
merchants.set(merchantsData as Array<Merchant>);

export const products = writable<Array<Product>>([]);
products.set(productsData as Array<Product>);

// merchants filter
export const filterMerchantsCategory = writable<Category>();
filterMerchantsCategory.set(Category.Semua)
export const filterMerchantsFreeParking = writable<Parking>();
filterMerchantsFreeParking.set(Parking.Semua)
export const filterMerchantsOpen = writable<Open>();
filterMerchantsOpen.set(Open.Semua)