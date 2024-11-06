<script lang="ts">
	import ModalOrder from '$lib/components/ModalOrder.svelte';
	import OrderableProduct from '$lib/components/OrderableProduct.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import BadgeCategory from '$lib/components/ui/BadgeCategory.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { onMount } from 'svelte';
	import { Category } from '../../constants/category';
	import { prevPage } from '../../helper/back';
	import { goto } from '$app/navigation';
	import { slide } from 'svelte/transition';
	import type { Order } from '../../constants/order';
	import type Merchant from '../../constants/merchant';
	import { orders, products as productsData } from '../../stores/store';
	import { merchants as merchantsData } from '../../stores/store';
	import { allDays } from '../../constants/merchant';
	import AutocompleteProduct from './ui/AutocompleteProduct.svelte';
	import { scrollToSection } from '../../helper/goto';
	import CheckOrders from './CheckOrders.svelte';
	import OnlyOpenTroughTelegram from './OnlyOpenTroughTelegram.svelte';
	import { isMerchantOpen } from '../../helper/time';
	import { browser } from '$app/environment';
	import type Product from '../../constants/product';
	import { Parking } from '../../constants/parking';

	// variables
	export let merchantId: string;
	let merchant: Merchant;
	let localOrders: Array<Order> = [];
	let subCategories: Array<Category | string> = [];
	let triggerNum: number = 0; // To Trigger modify qty on modal, modify the value inside modal and all component that need change from the orders store
	onMount(() => {
		// const parts = window.location.pathname.split("/");
		// merchantId = parts[parts.length - 1];
		orders.subscribe((data) => {
			localOrders = data;
		});
	});

	let isComingFromTelegram: boolean = true;
	onMount(() => {
		// only coming from telegram allowed to use the website
		isComingFromTelegram = window.Telegram.WebApp.platform != 'unknown' ? true : false;
	});

	// check if merchant open
	let isOpen: boolean;
	$: {
		const now = new Date();
		isOpen = isMerchantOpen(now, merchant);
	}

	// search
	let isShownSearch: boolean = false;
	if (browser) {
		window.addEventListener('scroll', () => {
			window.scrollY >= 500 ? (isShownSearch = true) : (isShownSearch = false);
		});
	}

	// open days and hours
	let openDays: string = '';
	$: {
		if (merchant.open_days.length === 7) {
			openDays = 'Setiap hari';
		} else if (merchant.open_days.length === 6) {
			const closedDays = allDays.find((day) => !merchant.open_days.includes(day));
			openDays = `Setiap hari kecuali ${closedDays}`;
		} else {
			openDays = merchant.open_days.map((day) => allDays.find((d) => d === day)).join(', ');
		}
	}

	// available products
	let orderables: Array<Order> = [];
	$: {
		triggerNum;

		// get data from products of merchatId, and get edited qty products from orders store
		productsData.subscribe((data) => {
			const products = data.filter((o) => o.merchant_id === merchantId);
			const tempProducts = products.map((o) => {
				return {
					product: o,
					qty: 0
				};
			});
			orderables = tempProducts
				.map((o) => {
					let editedQtyProduct = o;
					orders.subscribe((data) => {
						data.map((i) => {
							if (i.product.id == o.product.id) {
								editedQtyProduct = i;
							}
						});
					});
					return editedQtyProduct;
				})
				.sort((a, b) => a.product.title.localeCompare(b.product.title));

			subCategories = getUniqueSubcategoriesAndSort(products);
		});
		merchantsData.subscribe((data) => {
			merchant = data.find((o) => o.id == merchantId) as Merchant;
		});
	}

	// orders
	const modifyQtyHandler = (order: Order, is_increase: boolean) => {
		const foundIndex = orderables.findIndex((o) => o.product.id === order.product.id);

		if (foundIndex !== -1) {
			orderables = [...orderables].sort((a, b) => a.product.title.localeCompare(b.product.title));

			if (is_increase) {
				orderables[foundIndex].qty += 1;
			} else {
				orderables[foundIndex].qty = Math.max(0, orderables[foundIndex].qty - 1); // Prevent negative quantity
			}
		}
	};
	$: {
		// UPDATE ORDERS STORE
		const updatedOrders: Array<Order> = orderables
			.filter((o) => o.qty > 0)
			.sort((a, b) => a.product.title.localeCompare(b.product.title));
		orders.update((curOrders) => {
			const tempCurOrders = curOrders.filter((o) => o.product.merchant_id !== merchantId);
			return [...tempCurOrders, ...updatedOrders];
		});
	}

	// search item
	let searchInput: string = '';

	// handlers
	const openMapHandler = () => {
		window.open(merchant.gmap_url, '_blank');
	};
	const autoCompleteProductHandler = (product_id: string) => {
		searchInput = orderables.find((o) => o.product.id === product_id)?.product.title || '';
		scrollToSection(product_id);
	};
	const getUniqueSubcategoriesAndSort = (data: Array<Product>): Array<Category | string> => {
		const uniqueSubCategories = [...new Set(data.map((product) => product.subcategory))];
		return uniqueSubCategories;
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if isComingFromTelegram}
	<div id="bg" class="min-h-screen h-full bg-primary relative pb-16">
		<!-- search -->
		{#if isShownSearch}
			<div
				in:slide
				out:slide
				id="search"
				class="fixed flex top-8 w-full justify-between items-center"
			>
				<i class="fa-solid fa-circle-chevron-left text-secondary text-5xl ml-4" on:click={prevPage}
				></i>
				<AutocompleteProduct
					placeholder="Cari item.."
					bind:inputText={searchInput}
					autocompleteData={orderables.map((o) => o.product)}
					autoCompleteHandler={autoCompleteProductHandler}
				/>
			</div>
		{/if}

		<!-- header -->
		<div id="header" class="relative flex justify-center mb-8">
			<img
				src="/img/merchants/{merchantId}/thumbnail.png"
				alt="merchant"
				class="w-full h-[350px] rounded-b-xl brightness-50 {!isOpen ? 'brightness-[25%]' : ''}"
			/>
			{#if !isOpen}
				<span
					class="text-secondary !font-bold !text-2xl text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
					>MASIH TUTUPP 🚫</span
				>
			{/if}
			<!-- topbar -->
			<div
				id="topbar"
				class="absolute top-4 w-full px-6 mt-2 mb-8 flex flex-col gap-1 items-center"
			>
				<div id="title" class="w-full flex justify-between items-center gap-4">
					<i class="fa-solid fa-chevron-left text-secondary text-2xl" on:click={prevPage}></i>
					<h2 class="text-white text-center mb-4">{merchant?.title || '...'}</h2>
					<i class="just_for_padding"></i>
				</div>
				<!-- badges -->
				<div id="badges" class="flex gap-2">
					<BadgeCategory category={merchant?.category} />
					{#if merchant?.is_parking_free == true}
						<Badge
							bgColor="bg-green-500"
							textColor="text-secondary"
							text={Parking['Bebas Parkir']}
						/>
					{:else if merchant.is_parking_free == false}
						<Badge bgColor="bg-red-500" textColor="text-secondary" text={Parking.Parkir} />
					{:else if merchant.is_parking_free == null}
						<Badge
							bgColor="bg-yellow-500"
							textColor="text-secondary"
							text={Parking['Tidak Diketahui']}
						/>
					{/if}
					{#if !merchant.is_easy_driver}
						<Badge bgColor="bg-red-500" textColor="text-secondary" text="Sepi Driver⚠️" />
					{/if}
				</div>
			</div>
			<!-- opening hours -->
			<div id="opening-hours" class="absolute bottom-20 text-center">
				<span class="text-secondary block">Hari buka: {openDays}</span>
				<span class="text-secondary"
					>Jam buka: {merchant?.open_hour}.00 - {merchant?.close_hour}.00</span
				>
			</div>
			<!-- openmap button -->
			<div id="btn-open-maps" class="absolute bottom-6">
				<Button
					text="Buka di Maps"
					size="md"
					bgColor="bg-white"
					textColor="text-dark"
					on:click={openMapHandler}
				/>
			</div>
		</div>

		<!-- main -->
		{#if isOpen}
			<div id="main" class="flex flex-col gap-16 px-4">
				{#each { length: subCategories.length } as _, i}
					<div id={subCategories[i]} class="flex flex-col gap-4">
						<h3 class="text-start text-dark">{subCategories[i]}</h3>
						<div id="food-list" class="flex flex-col gap-8">
							{#each orderables as order}
								{#if order.product.subcategory == subCategories[i]}
									<OrderableProduct {order} {modifyQtyHandler} />
								{/if}
							{/each}
						</div>
					</div>
				{/each}
			</div>

			<CheckOrders bind:triggerNum />
		{/if}
	</div>
{:else}
	<OnlyOpenTroughTelegram />
{/if}

<style>
	.fa-circle-chevron-left {
		text-shadow: 0 0 3px #000;
	}
	#bg {
		position: relative;
		z-index: 1;
	}

	#bg::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image: url('/img/background.png');
		background-position: top left;
		background-repeat: repeat;
		background-size: contain;
		opacity: 0.1;
		filter: blur(1px);
		z-index: -1;
	}
</style>
