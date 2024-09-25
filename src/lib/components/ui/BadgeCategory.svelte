<script lang="ts">
	import { onMount } from "svelte";
	import { Category } from "../../../constants/category";
	import Badge from "./Badge.svelte";

    export let category: Category;

    let bgColor: string; // tailwind color
    let textColor: string; // tailwind color

    $: {
        switch (category) {
            case Category.Makanan:
                bgColor = "bg-orange-500";
                textColor = "text-secondary";
                break;
            case Category.Minuman:
                bgColor = "bg-blue-500";
                textColor = "text-secondary";
                break;
            case Category.Jajanan:
                bgColor = "bg-yellow-500";
                textColor = "text-secondary";
                break;
            default:
                bgColor = "bg-gray-500";
                textColor = "text-secondary";
                break;
        }
    }
</script>

<Badge bgColor={bgColor} textColor={textColor} text={category} />