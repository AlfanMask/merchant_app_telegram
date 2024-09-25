<script lang="ts">
	import { Category } from "../../constants/category";
	import type Product from "../../constants/product";
	import { formatRupiah } from "../../helper/formatter";
	import BadgeCategory from "./ui/BadgeCategory.svelte";

    export let product: Product;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click class="flex gap-4 w-full">
    <img src="/img/merchants/{product.merchant_id}/products/{product.id}.png" alt="product" class="w-24 h-24 rounded-xl">
    <div class="flex flex-col">
        <BadgeCategory category={product.category}/>
        <h3 class="mt-2 mb-1 text">{product.title}</h3>
        <span class="text-dark">{formatRupiah(product.price)}</span>
    </div>
</div>