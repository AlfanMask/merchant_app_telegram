<script lang="ts">
	import { goto } from "$app/navigation";
	import CategoryItem from "$lib/components/CategoryItem.svelte";
	import ProductPopularItem from "$lib/components/ProductPopularItem.svelte";
	import AutocompleteInput from "$lib/components/ui/AutocompleteInput.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import { Category } from "../constants/category";
	import type Merchant from "../constants/merchant";
	import type Product from "../constants/product";
	import { autoCompleteMerchantHandler } from "../helper/autocomplete";
	import { filterMerchantsCategory, products } from "../stores/store";
	import { merchants as merchantsData } from "../stores/store";

	// get data
	let popularProducts: Array<Product> = [];
	products.subscribe((data) => {
		popularProducts = data.filter(o => o.is_popular)
	})
	let merchants: Array<Merchant> = [];
	merchantsData.subscribe((data) => {
		merchants = data
	})

	// search merchant
	let searchInput: string = "";

	// handlers
	const clickCategoryHandler = (c: Category) => {
		filterMerchantsCategory.update(() => c)
		goto(`/merchants`)
	}

	const clickPopularProductHandler = (merchantId: string) => {
		goto(`/merchants/${merchantId}`)
	}

</script>

<div class="min-h-screen h-full bg-base">
	<!-- searchbar -->
	<div id="search" class="px-4 mb-8">
		<h2 class="text-white text-center mb-4">Selamat Mencari Makanan!</h2>
		<AutocompleteInput placeholder="Cari resto.." inputText={searchInput} autocompleteData={merchants.map(m => m.title)} autoCompleteHandler={autoCompleteMerchantHandler} />
	</div>

	<!-- main -->
	<div id="main" class="w-full h-full flex flex-col items-center px-4 bg-primary rounded-tl-3xl rounded-tr-3xl py-6">
		<!-- categories -->
		<div id="categories" class="flex flex-col gap-4 mb-8">
			<h3 class="text-start">Kategori</h3>
			<div class="flex gap-4">
				<CategoryItem imgSrc="/img/dummy-image.png" title={Category.Makanan} on:click={() => clickCategoryHandler(Category.Makanan)} />
				<CategoryItem imgSrc="/img/dummy-image.png" title={Category.Minuman} on:click={() => clickCategoryHandler(Category.Minuman)} />
				<CategoryItem imgSrc="/img/dummy-image.png" title={Category.Jajanan} on:click={() => clickCategoryHandler(Category.Jajanan)} />
				<CategoryItem imgSrc="/img/dummy-image.png" title={Category.Semua} on:click={() => clickCategoryHandler(Category.Semua)} />
			</div>
		</div>

		<!-- popular products -->
		<div id="popular-products" class="w-full flex flex-col gap-4 mb-12">
			<h3 class="text-start">Produk Populer</h3>
			<div class="flex flex-col gap-6">
				{#each popularProducts as product}
					<ProductPopularItem {product} on:click={() => clickPopularProductHandler(product.merchant_id)} />
				{/each}
			</div>
		</div>

		<!-- see all merchants -->
		<Button text="Lihat Semua Resto" on:click={() => clickCategoryHandler(Category.Semua)} />
	</div>

</div>
