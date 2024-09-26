<script lang="ts">
	import { goto } from "$app/navigation";
	import MerchantItem from "$lib/components/MerchantItem.svelte";
	import AutocompleteMerchant from "$lib/components/ui/AutocompleteMerchant.svelte";
	import { Category } from "../../constants/category";
	import type Merchant from "../../constants/merchant";
	import { Parking } from "../../constants/parking";
	import { autoCompleteMerchantHandler } from "../../helper/autocomplete";
	import { prevPage } from "../../helper/back";
    import { filterMerchantsCategory as filterMerchantsCategoryStore, filterMerchantsFreeParking as filterMerchantsFreeParkingStore, merchants as merchantsData } from "../../stores/store";

    // get merchants data
    let allMerchants: Array<Merchant> = [];
    let displayedMerchants: Array<Merchant> = [];
    merchantsData.subscribe((data) => {
        allMerchants = data
    })

    // search merchant
	let searchInput: string = "";

    // filters
    let filterMerchantsCategory: Category = Category.Semua;
    let filterMerchantsFreeParking: Parking = Parking.Semua;

    filterMerchantsCategoryStore.subscribe((data) => {
        filterMerchantsCategory = data
    })
    filterMerchantsFreeParkingStore.subscribe((data) => {
        filterMerchantsFreeParking = data
    })

    // handle filtered data
    $: {
        // check if not ALL CATEGORIES
        let filteredMerchantsTemp: Array<Merchant> = [];
        if (filterMerchantsCategory != Category.Semua){
            filteredMerchantsTemp = allMerchants.filter(o => o.category == filterMerchantsCategory).sort((a, b) => a.title.localeCompare(b.title));
        } else {
            filteredMerchantsTemp = allMerchants
        }
        
        // check if not ALL PARKING TYPES
        if (filterMerchantsFreeParking != Parking.Semua) {
            if (filterMerchantsFreeParking == Parking["Bebas Parkir"]){
                displayedMerchants = filteredMerchantsTemp.filter(o => o.is_parking_free).sort((a, b) => a.title.localeCompare(b.title));
            } else {
                displayedMerchants = filteredMerchantsTemp.filter(o => !o.is_parking_free).sort((a, b) => a.title.localeCompare(b.title));
            }
        } else {
            displayedMerchants = filteredMerchantsTemp;
        }
    }

    // handlers
    const clickMerchantHandler = (id: string) => {
        goto(`/merchants/${id}`)
    }

    const clickBackToHome = () => {
        goto(`/`)
    }

</script>


<div class="min-h-screen h-full bg-primary py-8">
    <!-- searchbar -->
	<div id="search" class="px-4 mb-8 flex gap-4 items-center">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <i class="fa-solid fa-chevron-left text-dark" on:click={clickBackToHome}></i>
		<AutocompleteMerchant placeholder="Cari resto.." inputText={searchInput} autocompleteData={allMerchants} autoCompleteHandler={autoCompleteMerchantHandler} />
	</div>

    <!-- main -->
    <div id="main" class="px-4">
        <!-- topbar options -->
        <div id="topbar" class="w-full flex justify-center items-center gap-4 mb-8">
            <select id="select_category" bind:value={filterMerchantsCategory} class="rounded px-2 py-1">
                <option value={Category.Semua}>{Category.Semua} Kategori</option>
                <option value={Category.Makanan}>{Category.Makanan}</option>
                <option value={Category.Minuman}>{Category.Minuman}</option>
                <option value={Category.Jajanan}>{Category.Jajanan}</option>
            </select>
            <select id="select_parking" bind:value={filterMerchantsFreeParking} class="rounded px-2 py-1">
                <option value={Parking.Semua}>{Parking.Semua}</option>
                <option value={Parking["Bebas Parkir"]}>{Parking["Bebas Parkir"]}</option>
                <option value={Parking.Parkir}>{Parking.Parkir}</option>
            </select>
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
</div>