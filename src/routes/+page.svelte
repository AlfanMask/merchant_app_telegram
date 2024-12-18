<script lang="ts">
	import { goto } from '$app/navigation';
	import CategoryItem from '$lib/components/CategoryItem.svelte';
	import ProductPopularItem from '$lib/components/ProductPopularItem.svelte';
	import AutocompleteMerchant from '$lib/components/ui/AutocompleteMerchant.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { onMount } from 'svelte';
	import { Category } from '../constants/category';
	import type Merchant from '../constants/merchant';
	import type Product from '../constants/product';
	import { autoCompleteMerchantHandler } from '../helper/autocomplete';
	import {
		filterMerchantsCategory,
		lastPageNumber,
		products,
		filterMerchantsFreeParking,
		filterMerchantsOpen
	} from '../stores/store';
	import { merchants as merchantsData } from '../stores/store';
	import OnlyOpenTroughTelegram from '$lib/components/OnlyOpenTroughTelegram.svelte';
	import CheckOrders from '$lib/components/CheckOrders.svelte';
	import { Parking } from '../constants/parking';
	import { Open } from '../constants/open';
	import { page } from '$app/stores';

	// get data
	let merchants: Array<Merchant> = [];
	merchantsData.subscribe((data) => {
		merchants = data;
	});

	let popularProducts: Array<Product> = [];
	let triggerNum: number = 0; // To Trigger modify qty on modal, modify the value inside modal and all component that need change from the orders store
	products.subscribe((data) => {
		popularProducts = data
			.filter((o) => o.is_popular)
			.sort((a, b) => {
				if (a.category === Category.Makanan && b.category !== Category.Makanan) {
					return -1;
				}
				if (a.category !== Category.Makanan && b.category === Category.Makanan) {
					return 1;
				}
				return a.category.localeCompare(b.category); // sort alphabetically for other categories
			});

		// FOR DEBUGGING PRODUCTS CATEGORIES
		// const notMakananMinuman = data
		// 	.filter(o => o.category != Category.Makanan && o.category != Category.Minuman && o.category != Category.Jajanan)
		// 	.reduce((acc, product) => {
		// 		acc.set(product.id, product);
		// 		return acc;
		// 	}, new Map());

		// const uniqueProducts = Array.from(notMakananMinuman.values());
		// console.log("notMakananMinuman: ", notMakananMinuman)
	});
	// re-filter products after filter merchants by user's univ only popular products corresponding for the user's univ
	$: popularProducts = popularProducts.filter((o) => merchants.map(i => i.id).includes(o.merchant_id));

	let isComingFromTelegram: boolean = true;
	onMount(() => {
		// only coming from telegram allowed to use the website
		const fromKampuskuApp = $page.url.searchParams.get("from-kampusku-app")
		isComingFromTelegram = window.Telegram.WebApp.platform != 'unknown' || fromKampuskuApp != "" ? true : false;

		// reset lastPageIndex on merchants page
		lastPageNumber.set(0);

		// filter and update base merchants store data only show the user's univ merchants
		const univ = $page.url.searchParams.get("univ");
		if (univ) {
			const filteredMerchantsByUniv = merchants.filter((m) => m.univ === univ);
			// merchants = filteredMerchantsByUniv;
			merchantsData.set(filteredMerchantsByUniv);
		}

		// reset all merchant list filters
		filterMerchantsCategory.set(Category.Semua);
		filterMerchantsFreeParking.set(Parking.Semua);
		filterMerchantsOpen.set(Open.Semua);
	});

	// search merchant
	let searchInput: string = '';

	// handlers
	const clickCategoryHandler = (c: Category) => {
		filterMerchantsCategory.update(() => c);
		goto(`/merchants`);
	};

	const clickPopularProductHandler = (merchantId: string) => {
		goto(`/merchants/${merchantId}`);
	};
</script>

{#if isComingFromTelegram}
	<div class="min-h-screen h-full bg-base">
		<!-- searchbar -->
		<div id="search" class="px-4 mb-8 mt-6">
			<h2 class="text-white text-center mb-4">Selamat Nyari Mamm!</h2>
			<AutocompleteMerchant
				placeholder="Cari resto.."
				inputText={searchInput}
				autocompleteData={merchants}
				autoCompleteHandler={autoCompleteMerchantHandler}
			/>
		</div>

		<!-- main -->
		<div
			id="main"
			class="w-full h-full flex flex-col items-center px-4 min-h-screen bg-primary rounded-tl-3xl rounded-tr-3xl py-6"
		>
			<!-- categories -->
			<div id="categories" class="flex flex-col gap-4 mb-8">
				<h3 class="text-start">Kategori</h3>
				<div class="flex gap-4">
					<CategoryItem
						imgSrc="/img/categories/category-food.png"
						title={Category.Makanan}
						on:click={() => clickCategoryHandler(Category.Makanan)}
					/>
					<CategoryItem
						imgSrc="/img/categories/category-drink.png"
						title={Category.Minuman}
						on:click={() => clickCategoryHandler(Category.Minuman)}
					/>
					<CategoryItem
						imgSrc="/img/categories/category-snack.png"
						title={Category.Jajanan}
						on:click={() => clickCategoryHandler(Category.Jajanan)}
					/>
					<CategoryItem
						imgSrc="/img/categories/category-other.png"
						title={Category.Semua}
						on:click={() => clickCategoryHandler(Category.Semua)}
					/>
				</div>
			</div>

			<!-- popular merchants -->
			<div id="popular-products" class="w-full flex flex-col gap-4 mb-12">
				<h3 class="text-start">Produk Populer</h3>
				<div class="flex flex-col gap-6">
					{#each popularProducts as product}
						<ProductPopularItem
							{product}
							on:click={() => clickPopularProductHandler(product.merchant_id)}
						/>
					{/each}
				</div>
			</div>

			<!-- Order Button Global Component -->
			<CheckOrders bind:triggerNum />
		</div>
	</div>
{:else}
	<OnlyOpenTroughTelegram />
{/if}

<style lang="postcss">
	#main {
		position: relative;
		z-index: 1;
	}

	#main::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image: url('/img/background.png');
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		opacity: 0.1;
		filter: blur(1px);
		z-index: -1;
	}
</style>
