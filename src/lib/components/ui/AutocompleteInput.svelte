<script lang="ts">
    export let inputText: string;
    export let autocompleteData: Array<string>;
    export let placeholder: string = "";
    export let autoCompleteHandler: (i: number) => void;

    let autocompleteItems: Array<string>;
    $: if (inputText) {
        autocompleteItems = autocompleteData.filter(country => {
            if (country.toLowerCase() !== inputText.toLowerCase() && country.toLowerCase().includes(inputText.toLocaleLowerCase())) {
                return country;
            }
        })
    } else {
        autocompleteItems = [];
    }

</script>

<div class="relative">
    <input
        type="text"
        placeholder="{placeholder}"
        bind:value={ inputText }
        class="rounded-3xl w-full h-10 p-4 border border-solid border-secondary"
    />
    {#if (autocompleteItems.length > 0)}
    <div class="flex flex-col gap-1 p-4 mt-2 absolute bg-white rounded-xl w-full z-10 shadow-lg">
        {#each autocompleteItems as item, i}
            <button class="w-full p-x2 cursor-pointer text-start text-black" on:click={ () => autoCompleteHandler(i) }>{item}</button>
        {/each}
    </div>
    {/if}
</div>