<script lang="ts">
	import { Category } from "../../constants/category";
	import type { Order } from "../../constants/order";
	import { formatRupiah } from "../../helper/formatter";
	import { products } from "../../stores/store";

    export let order: Order;
    export let modifyQtyHandler: (product: Order, is_increase: boolean) => void;
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
<div on:click id={order.product.id} class="flex gap-4 w-full">
    <!-- TODO: put img based on product's thumbnail -->
    <!-- <img src="/img/merchants/{order.product.merchant_id}/products/{order.product.id}.png" alt="product" class="w-24 h-24 rounded-xl"> -->
    <img src="{imgSrc}" alt="product" class="w-24 h-24 rounded-xl">
    <div class="flex flex-col w-full">
        <span class="mt-2 !text-lg !font-bold text-dark">{order.product.title}</span>
        {#if (order.product.description)}
            <span class="!font-medium text-dark !text-xs">{order.product.description}</span>
        {/if}
        <span class="!font-medium text-dark !text-lg mt-1">{formatRupiah(order.product.price)}</span>
    </div>
    <div id="counter" class="flex items-center">
        <i class="fa-solid fa-minus" on:click={() => modifyQtyHandler(order, false)}></i>
        <span>{order.qty}</span>
        <i class="fa-solid fa-plus" on:click={() => modifyQtyHandler(order, true)}></i>
    </div>
</div>

<style lang="postcss">
    /* all sections */
    div {
        scroll-margin: 120px;
    }
    #counter i, #counter span {
        @apply border border-solid border-secondary h-6 w-6 text-center items-center text-dark
    }   
</style>