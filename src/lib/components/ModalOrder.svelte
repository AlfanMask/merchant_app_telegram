<script lang="ts">
	import { onMount } from "svelte";
	import { Category } from "../../constants/category";
	import ProductOrder from "./ProductOrder.svelte";
	import Button from "./ui/Button.svelte";
    import Modal from "./ui/Modal.svelte";
	import type { Order, OrdersData } from "../../constants/order";
	import { formatRupiah } from "../../helper/formatter";
	import { orders, merchants } from "../../stores/store";
	import type Merchant from "../../constants/merchant";

    export let showModal: boolean;
    export let modifyQtyHandler: (order: Order, is_increase: boolean) => void;
    export let triggerNum: number = 0;
    let localOrders: Array<OrdersData> = [];
    let totalPrice: number;
    let merchantIds: Array<string> = [];
    let inputNote: string = "";

    $: {
        orders.subscribe((ordersData) => {
            triggerNum
            totalPrice = ordersData.reduce((prev, curr) => prev + (curr.product.price * curr.qty), 0)
            
            // check how many merchants in ordersData
            const uniqueMerchantIdss = [...new Set(ordersData.map(order => order.product.merchant_id))];
            merchantIds = uniqueMerchantIdss;
    
            // put each merchant's orders in localOrders
            let localMerchants: Array<Merchant> = [];
            merchants.subscribe((merchantsData) => {
                localMerchants = merchantsData
            })
    
            let tempLocalOrders: Array<OrdersData> = [];
            for (let i = 0; i < merchantIds.length; i++) {
                const merchantId = uniqueMerchantIdss[i];
                const merchantOrders = ordersData.filter(order => order.product.merchant_id === merchantId);
                tempLocalOrders.push({
                    orders: merchantOrders,
                    merchant: localMerchants.find(merchant => merchant.id === merchantId) as Merchant,
                });
            }
            localOrders = [...tempLocalOrders]
        })
    }

    // TODO: ERROR. modify qty from multiple merchants, if qty of a product is 0 it is not dissapear

    // handler
    interface OrdersDataToBot {
        multipleOrdersData: Array<OrdersData>,
        note: string,
    }
    const placeOrderHandler = () => {
        // send orders data to bot
        let data: OrdersDataToBot = {
            multipleOrdersData: localOrders,
            note: inputNote,
        }
        window.Telegram.WebApp.sendData(JSON.stringify({ data }));
    }

</script>

{#if showModal}
<div class="px-4">
    <Modal bind:showModal>
        <h3 class="mb-4">Apakah kamu yakin dengan orderanmu?</h3>
        <div class="order-list flex flex-col gap-6 w-full mb-4">
            {#each localOrders as lO, i}
                {#if (lO.merchant.id === merchantIds[i])}
                <div class="flex flex-col gap-2">
                    <span class="!font-bold underline mb-1">{localOrders[i].merchant.title}</span>
                    {#each localOrders[i].orders as order}
                        <ProductOrder {order} modifyQtyHandler={modifyQtyHandler} />
                    {/each}
                </div>
                {/if}
            {/each}
        </div>
        <hr class="mb-4">
        <div id="note" class="mb-4">
            <textarea bind:value={inputNote} placeholder="Catatan untuk driver.." class="!text-sm !font-light w-full px-4 py-2 rounded border border-solid border-secondary"/>
        </div>
        <div id="bottom" class="flex flex-col items-center w-full gap-3">
            <span class="text-dark !text-xl !font-bold block">Total: {formatRupiah(totalPrice)}</span>
            <Button text="Posting Orderan" on:click={placeOrderHandler} />
        </div>
    </Modal>
</div>
{/if}