<script lang="ts">
	import ModalOrder from "$lib/components/ModalOrder.svelte";
    import OrderableProduct from "$lib/components/OrderableProduct.svelte";
    import Badge from "$lib/components/ui/Badge.svelte";
	import BadgeCategory from "$lib/components/ui/BadgeCategory.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import { onMount } from "svelte";
	import { Category } from "../../constants/category";
	import { prevPage } from "../../helper/back"; 
	import { goto } from "$app/navigation";
	import { slide } from "svelte/transition";
	import type { Order } from "../../constants/order";
	import type Merchant from "../../constants/merchant";
    import { products as productsData } from "../../stores/store";
    import { merchants as merchantsData } from "../../stores/store";

    // get merchant.id
    export let merchantId: string;
    let merchant: Merchant;
    // onMount(() => {
    //     const parts = window.location.pathname.split("/");
    //     merchantId = parts[parts.length - 1];
    // })

    // available products
    let orderables: Array<Order> = [];
    $: {
        
        // get data from products of merchatId
        productsData.subscribe((data) => {
            const products = data.filter(o => o.merchant_id === merchantId)
            orderables = products.map(o => {
                return {
                    product: o,
                    qty: 0,
                }
            }).sort((a, b) => a.product.title.localeCompare(b.product.title));
        })
        merchantsData.subscribe((data) => {
            merchant = data.find(o => o.id == merchantId) as Merchant;
        })
    }
    
    // orders
    let orders: Array<Order> = [];
    const modifyQtyHandler = (order: Order, is_increase: boolean) => {
        const foundIndex = orderables.findIndex(o => o.product.id === order.product.id);

        if (foundIndex !== -1) {
            orderables = [...orderables].sort((a, b) => a.product.title.localeCompare(b.product.title));;

            if (is_increase) {
                orderables[foundIndex].qty += 1;
            } else {
                orderables[foundIndex].qty = Math.max(0, orderables[foundIndex].qty - 1); // Prevent negative quantity
            }
        }
    }
    $: {
        orders = orderables.filter(o => o.qty > 0).sort((a, b) => a.product.title.localeCompare(b.product.title));
    }

    // handlers
    let showModal: boolean = false;
    const placeOrderHandler = () => {
        showModal = true;
    }
    const openMapHandler = () => {
        window.open(merchant.gmap_url, "_blank");
    }

</script>

<div class="min-h-screen h-full bg-primary relative pb-16">
    <!-- header -->
    <div id="header" class="relative flex justify-center mb-8">
        <img src="/img/merchants/{merchantId}/thumbnail.png" alt="merchant" class="w-full h-400 rounded-b-xl brightness-75">
        <!-- topbar -->
        <div id="topbar" class="absolute top-4 w-full px-4 mt-2 mb-8 flex flex-col gap-1 items-center">
            <div id="title" class="w-full flex justify-between items-center gap-4">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <i class="fa-solid fa-chevron-left text-secondary" on:click={prevPage}></i>
                <h2 class="text-white text-center mb-4">{merchant?.title || "..."}</h2>
                <i class="just_for_padding"></i>
            </div>
            <div id="badges" class="flex gap-2">
                <BadgeCategory category={merchant?.category} />
                {#if (merchant?.is_parking_free)}
                <Badge bgColor="bg-green-500" textColor="text-secondary" text="Bebas Parkir" />
                {/if}
            </div>
        </div>
        <!-- badges -->
        <!-- openmap button -->
        <div id="btn-open-maps" class="absolute bottom-6">
            <Button text="Buka di Maps" size="md" bgColor="bg-white" textColor="text-dark" on:click={openMapHandler} />
        </div>
    </div>

    <!-- main -->
    <div id="main" class="flex flex-col gap-16 px-4">
        <!-- foods -->
        <div id="foods" class="flex flex-col gap-4">
            <h3 class="text-start text-dark">Makanan</h3>
            <div id="food-list" class="flex flex-col gap-8">
                {#each orderables as order}
                    {#if (order.product.category === Category.Makanan) || (order.product.category === Category.Jajanan)}
                        <OrderableProduct order={order} {modifyQtyHandler} />
                    {/if}
                {/each}
            </div>
        </div>
        <!-- drinks -->
        <div id="drinks" class="flex flex-col gap-4">
            <h3 class="text-start text-dark">Minuman</h3>
            <div id="drink-list" class="flex flex-col gap-4">
                {#each orderables as order}
                    {#if (order.product.category === Category.Minuman)}
                        <OrderableProduct order={order} {modifyQtyHandler} />
                    {/if}
                {/each}
            </div>
        </div>
    </div>

    <!-- order button -->
    {#if orders.length > 0}
    <div in:slide out:slide id="btn-order" class="fixed bottom-[5%] w-full h-fit flex justify-center">
        <Button text="Buat Pesanan" size="lg" bgColor="bg-base" textColor="text-secondary" on:click={placeOrderHandler} />
    </div>
    {/if}

    <ModalOrder bind:showModal orders={orders} merchantName={merchant?.title} isParkingFree={merchant?.is_parking_free} />
</div>