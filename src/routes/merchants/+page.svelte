<script lang="ts">
	import { goto } from "$app/navigation";
	import CheckOrders from "$lib/components/CheckOrders.svelte";
	import MerchantItem from "$lib/components/MerchantItem.svelte";
	import AutocompleteMerchant from "$lib/components/ui/AutocompleteMerchant.svelte";
	import Modal from "$lib/components/ui/Modal.svelte";
	import { onMount } from "svelte";
	import { Category } from "../../constants/category";
	import type Merchant from "../../constants/merchant";
	import { allDays } from "../../constants/merchant";
	import { Open } from "../../constants/open";
	import { Parking } from "../../constants/parking";
	import { autoCompleteMerchantHandler } from "../../helper/autocomplete";
	import { prevPage } from "../../helper/back";
	import { isMerchantOpen } from "../../helper/time";
    import { filterMerchantsCategory as filterMerchantsCategoryStore, filterMerchantsFreeParking as filterMerchantsFreeParkingStore, filterMerchantsOpen as filterMerchantsOpenStore, merchants as merchantsData, lastPageNumber } from "../../stores/store";
	import OnlyOpenTroughTelegram from "$lib/components/OnlyOpenTroughTelegram.svelte";

    // get merchants data
    let allMerchants: Array<Merchant> = [];
    let displayedMerchants: Array<Merchant> = [];
    let isShowRestoClosedMessage: string = "";
    let localFilteredMerchants: Array<Merchant> = [];
    merchantsData.subscribe((data) => {
        allMerchants = data
    })

    // pagination
    let pageIndex: number = 0;
    const dataPerPage: number = 6;
    let totalPages: number = 1;
    $: totalPages = Math.ceil(localFilteredMerchants.length / dataPerPage);

    let isComingFromTelegram: boolean = true;
	onMount(() => {
		// only coming from telegram allowed to use the website
        // TODO:
		isComingFromTelegram = window.Telegram.WebApp.platform != 'unknown' ? true : true;

        // check if there is any lastPageNumber index -> go with it
        lastPageNumber.subscribe((data) => {
            pageIndex = data;
        })
	})



    // search merchant
	let searchInput: string = "";

    // filters
    let filterMerchantsCategory: Category = Category.Semua;
    let filterMerchantsFreeParking: Parking = Parking.Semua;
    let filterMerchantsOpen: Open = Open.Semua;

    filterMerchantsCategoryStore.subscribe((data) => {
        filterMerchantsCategory = data
    })
    filterMerchantsFreeParkingStore.subscribe((data) => {
        filterMerchantsFreeParking = data
    })
    filterMerchantsOpenStore.subscribe((data) => {
        filterMerchantsOpen = data
    })

    // handle filtered data
    $: {
        // Filter by category if not "Semua"
        let filteredMerchants = filterMerchantsCategory != Category.Semua
            ? allMerchants.filter(o => o.category == filterMerchantsCategory)
            : allMerchants;

        // Filter by parking type if not "Semua"
        if (filterMerchantsFreeParking != Parking.Semua) {
            filteredMerchants = filteredMerchants.filter(o => 
                filterMerchantsFreeParking == Parking["Bebas Parkir"] ? o.is_parking_free : !o.is_parking_free
            );
        }

        // Filter by open status if not "Semua"
        if (filterMerchantsOpen != Open.Semua) {
            filteredMerchants = filteredMerchants.filter(o => 
                filterMerchantsOpen == Open.Open ? isMerchantOpen(new Date(), o) : !isMerchantOpen(new Date(), o)
            );
        }

        // Set the final displayed merchants
        localFilteredMerchants =  filteredMerchants
        displayedMerchants = filteredMerchants.slice(pageIndex * dataPerPage, (pageIndex + 1) * dataPerPage);
    }

    // handlers
    const clickMerchantHandler = (id: string) => {
        // redirect to merchant page if open
        const now = new Date();
        const merchantToOpen: Merchant = displayedMerchants.find(o => o.id === id) as Merchant;
        const isOpen = isMerchantOpen(now, merchantToOpen)

        if (isOpen){
            goto(`/merchants/${id}`)
        } else {
            let openDays: string = "";
            if (merchantToOpen.open_days.length === 7) {
                openDays = "setiap hari";
            } else if (merchantToOpen.open_days.length === 6) {
                const closedDays = allDays.find(day => !merchantToOpen.open_days.includes(day));
                openDays = `setiap hari (kecuali ${closedDays})`;
            } else {
                openDays = merchantToOpen.open_days.map(day => allDays.find(d => d === day)).join(", ");
            }
            isShowRestoClosedMessage = "Maaf, resto tutup :( Resto ini buka " + openDays + " dari jam " + merchantToOpen.open_hour + ".00 sampai jam " + merchantToOpen.close_hour + ".00"
        }

        // save lastPageNumber to store
        lastPageNumber.set(pageIndex)
    }

    const clickBackToHome = () => {
        goto(`/`)
    }

    const movePage = (navigation: "next" | "prev") => {
        if (navigation === "next") {
            if(pageIndex < (totalPages-1)) {
                pageIndex += 1
            } else {
                pageIndex = 0
            }
        } else if (navigation === "prev") {
            if (pageIndex > 0) {
                pageIndex -= 1
            } else {
                pageIndex = (totalPages-1);
            }
        }
    }

    const resetPageIndex = () => {
        pageIndex = 0
    }

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if isComingFromTelegram}
<div id="bg" class="min-h-screen h-full bg-primary py-8">
    {#if isShowRestoClosedMessage}
        <Modal showModal={isShowRestoClosedMessage != "" ? true : false}>
            <span class="!text-lg">{isShowRestoClosedMessage}</span>
        </Modal>
    {/if}
    
    <!-- searchbar -->
	<div id="search" class="fixed px-6 mb-8 flex gap-4 items-center z-50">
        <i class="fa-solid fa-circle-chevron-left text-secondary text-4xl" on:click={clickBackToHome}></i>
		<AutocompleteMerchant placeholder="Cari resto.." inputText={searchInput} autocompleteData={allMerchants} autoCompleteHandler={autoCompleteMerchantHandler} />
	</div>

    <!-- main -->
    <div id="main" class="px-4 mt-20">
        <!-- topbar options -->
        <div id="topbar" class="w-full mb-8 flex flex-col gap-4">
            <select id="select_category" bind:value={filterMerchantsCategory} on:change={resetPageIndex} class="w-full rounded px-2 py-2 border border-solid border-secondary">
                <option value={Category.Semua}>{Category.Semua} Kategori</option>
                <option value={Category.Makanan}>{Category.Makanan}</option>
                <option value={Category.Minuman}>{Category.Minuman}</option>
                <option value={Category.Jajanan}>{Category.Jajanan}</option>
            </select>
            <div class="grid grid-cols-2 items-center gap-4">
                <select id="select_parking" bind:value={filterMerchantsFreeParking} on:change={resetPageIndex} class="rounded px-2 py-2 border border-solid border-secondary">
                    <option value={Parking.Semua}>{Parking.Semua}</option>
                    <option value={Parking["Bebas Parkir"]}>{Parking["Bebas Parkir"]}</option>
                    <option value={Parking.Parkir}>{Parking.Parkir}</option>
                </select>
                <select id="select_open" bind:value={filterMerchantsOpen} on:change={resetPageIndex} class="rounded px-2 py-2 border border-solid border-secondary">
                    <option value={Open.Semua}>{Open.Semua}</option>
                    <option value={Open.Open}>{Open.Open}</option>
                    <option value={Open.Close}>{Open.Close}</option>
                </select>
            </div>
        </div>

        <!-- merchants -->
        {#if displayedMerchants.length > 0}
        <div id="merchants" class="grid grid-cols-2 gap-x-4 gap-y-6">
            {#each displayedMerchants as merchant}
                <MerchantItem {merchant} on:click={() => clickMerchantHandler(merchant.id)} />
            {/each}
        </div>
        {:else}
            <h3 class="text-center text-dark mt-20">Maaf, restoran tidak ditemukan :(</h3>
        {/if}
    </div>

    <!-- show pagination if total pages > 1 -->
    {#if (totalPages > 1)}
    <div id="pagination" class="w-full flex justify-between items-center mt-6 opacity-75 fixed z-40 px-6 bottom-[2%] left-1/2 -translate-x-1/2 -translate-y-1/2">
        <i class="fa-solid fa-circle-chevron-left text-secondary text-5xl" on:click={() => movePage("prev")}></i>
        <!-- <span class="!text-lg !font-medium text-dark mx-6 flex items-center">{pageIndex+1}/<span class="!text-sm">{totalPages}</span></span> -->
        <i class="fa-solid fa-circle-chevron-right text-secondary text-5xl" on:click={() => movePage("next")}></i>
    </div>
    {/if}

    <CheckOrders />
    
</div>
{:else}
<OnlyOpenTroughTelegram />
{/if}

<style>
    .fa-circle-chevron-left, .fa-circle-chevron-right {
        text-shadow: 0 0 3px #000;;
    }
    #bg {
		position: relative;
		z-index: 1;
	}

	#bg::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image: url("/img/background.png");
		background-position: center;
		background-repeat: repeat;
		background-size: contain;
		opacity: 0.1;
        filter: blur(1px);
    	z-index: -1;
	}
</style>