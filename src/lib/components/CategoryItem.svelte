<script lang="ts">
	import type { Category } from "../../constants/category";

    export let imgSrc: string;
    export let title: Category;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click class="text-center">
    <img src="{imgSrc}" alt="{imgSrc}" class="w-full h-20 rounded-xl mb-1 object-cover">
    <span class="font-medium">{title}</span>
</div>