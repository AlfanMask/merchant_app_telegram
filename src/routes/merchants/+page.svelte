<script lang="ts">
	import { goto } from "$app/navigation";
	import MerchantItem from "$lib/components/MerchantItem.svelte";
	import AutocompleteMerchant from "$lib/components/ui/AutocompleteMerchant.svelte";
	import { Category } from "../../constants/category";
	import type Merchant from "../../constants/merchant";
	import { allDays } from "../../constants/merchant";
	import { Open } from "../../constants/open";
	import { Parking } from "../../constants/parking";
	import { autoCompleteMerchantHandler } from "../../helper/autocomplete";
	import { prevPage } from "../../helper/back";
	import { isMerchantOpen } from "../../helper/time";
    import { filterMerchantsCategory as filterMerchantsCategoryStore, filterMerchantsFreeParking as filterMerchantsFreeParkingStore, filterMerchantsOpen as filterMerchantsOpenStore, merchants as merchantsData } from "../../stores/store";

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

        // Sort by title (only needs to be done once)
        filteredMerchants.sort((a, b) => a.title.localeCompare(b.title));

        // Filter by open status if not "Semua"
        if (filterMerchantsOpen != Open.Semua) {
            filteredMerchants = filteredMerchants.filter(o => 
                filterMerchantsOpen == Open.Open ? isMerchantOpen(new Date(), o) : !isMerchantOpen(new Date(), o)
            );
        }

        // Set the final displayed merchants
        displayedMerchants = filteredMerchants;
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
                openDays = `setiap hari kecuali ${closedDays}`;
            } else {
                openDays = merchantToOpen.open_days.map(day => allDays.find(d => d === day)).join(", ");
            }
            alert("Maaf, resto tutup :(\n\nResto ini buka " + openDays + " dari jam " + merchantToOpen.open_hour + ".00 sampai jam " + merchantToOpen.close_hour + ".00");
        }
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
        <div id="topbar" class="w-full mb-8 flex flex-col gap-4">
            <select id="select_category" bind:value={filterMerchantsCategory} class="w-full rounded px-2 py-1">
                <option value={Category.Semua}>{Category.Semua} Kategori</option>
                <option value={Category.Makanan}>{Category.Makanan}</option>
                <option value={Category.Minuman}>{Category.Minuman}</option>
                <option value={Category.Jajanan}>{Category.Jajanan}</option>
            </select>
            <div class="grid grid-cols-2 items-center gap-4">
                <select id="select_parking" bind:value={filterMerchantsFreeParking} class="rounded px-2 py-1">
                    <option value={Parking.Semua}>{Parking.Semua}</option>
                    <option value={Parking["Bebas Parkir"]}>{Parking["Bebas Parkir"]}</option>
                    <option value={Parking.Parkir}>{Parking.Parkir}</option>
                </select>
                <select id="select_open" bind:value={filterMerchantsOpen} class="rounded px-2 py-1">
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
</div>