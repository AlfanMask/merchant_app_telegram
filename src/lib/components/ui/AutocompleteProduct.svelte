<script lang="ts">
	import { Category } from "../../../constants/category";
	import type Product from "../../../constants/product";

    export let inputText: string;
    export let autocompleteData: Array<Product>;
    export let placeholder: string = "";
    export let autoCompleteHandler: (id: string) => void;

    let autocompleteProducts: Array<Product>;
    $: if (inputText) {
        autocompleteProducts = autocompleteData.filter(product => {
            if (product.title.toLowerCase() !== inputText.toLowerCase() && product.title.toLowerCase().includes(inputText.toLocaleLowerCase())) {
                return product;
            }
        })
    } else {
        autocompleteProducts = [];
    }

</script>

<div class="relative w-full pl-4 pr-8">
    <input
        type="text"
        placeholder="{placeholder}"
        bind:value={ inputText }
        class="rounded-3xl w-full h-12 p-4 border border-solid border-secondary shadow-lg"
    />
    {#if (autocompleteProducts.length > 0)}
    <div class="flex flex-col gap-2 p-4 mt-2 absolute bg-white rounded-xl w-full z-10 shadow-lg">
        {#each autocompleteProducts as item, i}
            <button class="w-full p-x2 cursor-pointer text-start text-black" on:click={ () => autoCompleteHandler(item.id) }>{item.title}{(item.subcategory != Category.Makanan) && (item.subcategory != Category.Minuman) ? ` (${item.subcategory})` : ""}</button>
        {/each}
    </div>
    {/if}
</div>