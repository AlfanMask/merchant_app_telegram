<script lang="ts">
	import { onMount } from "svelte";
	import type { Order } from "../../constants/order";
	import { orders } from "../../stores/store";
	import Button from "./ui/Button.svelte";
	import ModalOrder from "./ModalOrder.svelte";
	import { slide } from "svelte/transition";

    let localOrders: Array<Order> = [];
    let showModal: boolean = false;
    export let triggerNum: number = 0;
    let justMounted: boolean = false;
    onMount(() => {
        orders.subscribe(data => {
            localOrders = data
        })
        justMounted = true
    })
    
    // handlers
    $: {
        const totalOrdersQty = localOrders.reduce((prev, curr) => prev + curr.qty, 0);
        if(totalOrdersQty === 0) {
            showModal = false;
        }
    }
    const checkOrderHandler = () => {
        showModal = true;
    }
    const modifyQtyHandler = (order: Order, is_increase: boolean) => {
        const foundIndex = localOrders.findIndex(o => o.product.id === order.product.id);

        if (foundIndex !== -1) {
            localOrders = [...localOrders]

            if (is_increase) {
                localOrders[foundIndex].qty += 1;
            } else {
                if (localOrders[foundIndex].qty - 1 <= 0) {
                    localOrders.splice(foundIndex, 1);
                } else {
                    localOrders[foundIndex].qty = Math.max(0, localOrders[foundIndex].qty - 1); // Prevent negative quantity
                }
            }
        }
        triggerNum += 1
    }

    $: {
        // UPDATE ORDERS STORE
        if (justMounted) orders.set(localOrders);
    }
</script>

<!-- order button -->
{#if localOrders.length > 0}
<div in:slide out:slide id="btn-order" class="fixed bottom-[5%] left-1/2 -translate-x-1/2 h-fit flex justify-center z-50">
    <Button text="Cek Pesanan" size="lg" bgColor="bg-base" textColor="text-secondary" on:click={checkOrderHandler} />
</div>
{/if}

<ModalOrder bind:showModal modifyQtyHandler={modifyQtyHandler} bind:triggerNum />