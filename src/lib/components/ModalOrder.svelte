<script lang="ts">
	import { onMount } from "svelte";
	import { Category } from "../../constants/category";
	import ProductOrder from "./ProductOrder.svelte";
	import Button from "./ui/Button.svelte";
    import Modal from "./ui/Modal.svelte";
	import type { Order, OrdersData } from "../../constants/order";
	import { formatRupiah } from "../../helper/formatter";

    export let merchantName: string;
    export let isParkingFree: boolean;
    export let showModal: boolean;
    export let orders: Array<Order>;
    let totalPrice: number;
    $: {
        totalPrice = orders.reduce((prev, curr) => prev + (curr.product.price * curr.qty), 0)

    }

    // handler
    const placeOrderHandler = () => {
        let data: OrdersData = {
            orders,
            merchant_name: merchantName,
            total_price: totalPrice,
            is_parking_free: isParkingFree,
        }
        window.Telegram.WebApp.sendData(JSON.stringify({ orders: data }));
    }
</script>

<div class="px-4 bg-green-400">
    <Modal bind:showModal>
        <h3 class="mb-4">Apakah kamu sudah yakin orderanmu?</h3>
        <div class="order-list flex flex-col gap-4 w-full mb-4">
            {#each orders as order }
                <ProductOrder title="{order.product.title}" price={order.product.price} category={order.product.category} qty={order.qty} />
            {/each}
        </div>
        <hr class="mb-4">
        <div id="bottom" class="flex flex-col items-center w-full gap-2">
            <span class="text-dark !text-lg !font-bold block">Total: {formatRupiah(totalPrice)}</span>
            <Button text="Posting Orderan" on:click={placeOrderHandler} />
        </div>
    </Modal>
</div>