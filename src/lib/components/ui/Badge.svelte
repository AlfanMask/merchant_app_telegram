<script lang="ts">
    export let text: string;
    export let bgColor: string; // tailwind color
    export let textColor: string; // tailwind color
</script>

<div class="flex justify-center items-center w-fit px-1.5 py-0.5 rounded-full {bgColor}">
    <span class="{textColor} !text-xs">{text}</span>
</div>