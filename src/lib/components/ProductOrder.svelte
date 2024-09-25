<script lang="ts">
	import { onMount } from "svelte";
	import { Category } from "../../constants/category";
	import { formatRupiah } from "../../helper/formatter";
	import BadgeCategory from "./ui/BadgeCategory.svelte";

    export let category: Category;
    export let title: string;
    export let price: number;
    export let qty: number;
    let totalPrice: number;

    onMount(() => {
        totalPrice = price * qty
    })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click class="flex gap-4 w-full">
    <img src="/img/dummy-image.png" alt="" class="w-24 h-24 rounded-xl">
    <div class="flex flex-col w-full">
        <BadgeCategory category={category}/>
        <h3 class="mt-2 mb-1 text">{title}</h3>
        <span class="text-dark">x {qty}</span>
    </div>
    <span class="text-dark !text-lg !font-bold">{formatRupiah(totalPrice)}</span>
</div>