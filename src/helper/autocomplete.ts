import { goto } from "$app/navigation"
import type Merchant from "../constants/merchant";
import { merchants as merchantsData } from "../stores/store";
import { scrollToSection } from "./goto";

let merchants: Array<Merchant> = [];
merchantsData.subscribe((data) => {
    merchants = data
})
const autoCompleteMerchantHandler = (merchantId: string) => {
    goto(`/merchants/${merchantId}`)
}

export { autoCompleteMerchantHandler }