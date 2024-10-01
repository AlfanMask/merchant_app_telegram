import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: 'build',
			assets: 'build',
			fallback: '',
			precompress: false,
			strict: true
		}),
		prerender: {
			// use relative URLs similar to an anchor tag <a href="/test/1"></a>
			// do not include group layout folders in the path such as /(group)/test/1
			entries: [
				'/', '/merchants',
				'/merchants/1_spesial_sambal', '/merchants/2_warung_jepun', '/merchants/3_arjes_kitchen', '/merchants/4_bale_enak', '/merchants/5_flavfour', '/merchants/6_nuno_penyet', '/merchants/7_takoyaki_gerdep', '/merchants/8_pancong_balap', '/merchants/9_pisang_aroma', '/merchants/10_karizmaku',
				'/merchants/11_pisang_sewelas', '/merchants/12_sarapan_bule', '/merchants/13_geprek_kumlot', '/merchants/14_bakso_sony', '/merchants/15_warung_se', '/merchants/16_geprek_fortuner', '/merchants/17_lapak_chicken', '/merchants/18_ayam_rektor', '/merchants/19_chicken_on_fire_jp', '/merchants/20_warung_bu_las',
				'/merchants/21_kebab_morgan', '/merchants/22_sate_aminah', '/merchants/23_olive_uns', '/merchants/24_seblak_bageur', '/merchants/25_mie_sentosa', '/merchants/26_ayam_penyet_andara', '/merchants/27_nasi_goreng_milyarder', '/merchants/28_harun_juice', '/merchants/29_bakmi_capcay_pak_bambang', '/merchants/30_bago_hot_chicken',
				'/merchants/31_geprel_mas_al', '/merchants/33_martabak_la_wawah', '/merchants/35_mie_serasi', '/merchants/36_gacoan_jebres', '/merchants/37_kedai_kabut', '/merchants/38_uma_yumcha', '/merchants/39_sego_cokot', '/merchants/40_haus',
				'/merchants/41_burjo_tiada_tara', '/merchants/42_belikopi', '/merchants/43_nice_spice', '/merchants/44_oma_opa', '/merchants/45_mie_jebew', '/merchants/46_bakso_mie_cendana',
			],
		}
	}
};

export default config;
