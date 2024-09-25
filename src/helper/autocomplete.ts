import { goto } from "$app/navigation"
import type Merchant from "../constants/merchant";
import { merchants as merchantsData } from "../stores/store";

let merchants: Array<Merchant> = [];
merchantsData.subscribe((data) => {
    merchants = data
})
const autoCompleteMerchantHandler = (index: number) => {
    goto(`/merchants/${merchants[index].id}`)
}

export { autoCompleteMerchantHandler }