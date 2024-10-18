<script lang="ts">
	import { Category } from "../../constants/category";
	import type Merchant from "../../constants/merchant";
	import { Parking } from "../../constants/parking";
	import { isMerchantOpen } from "../../helper/time";
	import Badge from "./ui/Badge.svelte";
	import BadgeCategory from "./ui/BadgeCategory.svelte";

    export let merchant: Merchant;
    export let textColor: string = "text-dark"; // tailwind-color = "text-dark"

    let isOpen: boolean;
    $: {
        const now = new Date();
        isOpen = isMerchantOpen(now, merchant)
    }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click class="flex flex-col w-full">
    <div id="bg_img" class="relative">
        <img src="/img/merchants/{merchant.id}/thumbnail.png" alt="merchant" class="w-full h-40 rounded-xl {!isOpen ? 'brightness-[40%]' : ''}">
        {#if !isOpen}
            <span class="text-secondary !font-bold !text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">TUTUP</span>
        {/if}
        <div class="absolute top-3 right-2 flex gap-2">
            <BadgeCategory category={merchant.category}/>
            {#if merchant.is_parking_free}
                <Badge bgColor="bg-green-500" textColor="text-secondary" text={Parking["Bebas Parkir"]} />
            {/if}
        </div>
    </div>
    <div class="flex flex-col items-center">
        <span class="mt-2 mb-1 !text-lg text-center {textColor}">{merchant.title}</span>
    </div>
</div>