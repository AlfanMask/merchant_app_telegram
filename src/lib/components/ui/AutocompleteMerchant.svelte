<script lang="ts">
	import type Merchant from "../../../constants/merchant";

    export let inputText: string;
    export let autocompleteData: Array<Merchant>;
    export let placeholder: string = "";
    export let autoCompleteHandler: (id: string) => void;

    let autocompleteMerchants: Array<Merchant>;
    $: if (inputText) {
        autocompleteMerchants = autocompleteData.filter(merchant => {
            if (merchant.title.toLowerCase().includes(inputText.toLocaleLowerCase())) {
                return merchant;
            }
        })
    } else {
        autocompleteMerchants = [];
    }

</script>

<div class="relative w-full px-2">
    <input
        type="text"
        placeholder="{placeholder}"
        bind:value={ inputText }
        class="rounded-3xl w-full h-12 p-4 border border-solid border-secondary shadow-lg"
    />
    {#if (autocompleteMerchants.length > 0)}
    <div class="flex flex-col gap-2 p-4 mt-2 absolute bg-white rounded-xl w-full z-10 shadow-lg">
        {#each autocompleteMerchants as item, i}
            <button class="w-full p-x2 cursor-pointer text-start text-black" on:click={ () => autoCompleteHandler(item.id) }>{item.title}</button>
        {/each}
    </div>
    {/if}
</div>