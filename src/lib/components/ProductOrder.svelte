<script lang="ts">
	import { onMount } from "svelte";
	import { Category } from "../../constants/category";
	import { formatRupiah } from "../../helper/formatter";
	import BadgeCategory from "./ui/BadgeCategory.svelte";
	import type { Order } from "../../constants/order";

    // export let category: Category;
    // export let title: string;
    // export let price: number;
    // export let qty: number;
    export let order: Order;
    export let modifyQtyHandler: (product: Order, is_increase: boolean) => void;
    let totalPrice: number;

    $: {
        totalPrice = order.product.price * order.qty
    }

    let imgSrc: string = "";
    $: {
        switch(order.product.category) {
            case Category.Makanan:
                imgSrc = "/img/categories/category-food.png"
                break;
            case Category.Minuman:
                imgSrc = "/img/categories/category-drink.png"
                break;
            case Category.Jajanan:
                imgSrc = "/img/categories/category-snack.png"
                break;
            default:
                imgSrc = "/img/categories/category-other.png"
                break;
        }
    }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click class="flex gap-4 w-full">
    <!-- TODO: put img based on product's thumbnail -->
    <!-- <img src="/img/dummy-image.png" alt="" class="w-24 h-24 rounded-xl"> -->
    <img src="{imgSrc}" alt="product" class="w-24 h-24 rounded-xl">
    <div class="flex flex-col w-full">
        <BadgeCategory category={order.product.category}/>
        <h3 class="mt-2 mb-1 text">{order.product.title}</h3>
        <span class="text-dark">x {order.qty}</span>
    </div>
    <div class="flex flex-col">
        <span class="text-dark !text-lg !font-bold">{formatRupiah(totalPrice)}</span>
        <div id="counter" class="flex items-center">
            <i class="fa-solid fa-minus" on:click={() => modifyQtyHandler(order, false)}></i>
            <span>{order.qty}</span>
            <i class="fa-solid fa-plus" on:click={() => modifyQtyHandler(order, true)}></i>
        </div>
    </div>
</div>

<style lang="postcss">
    #counter i, #counter span {
        @apply border border-solid border-secondary h-6 w-6 text-center items-center text-dark
    }   
</style>