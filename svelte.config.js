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
				'/merchants/41_burjo_tiada_tara', '/merchants/42_belikopi', '/merchants/43_nice_spice', '/merchants/44_oma_opa', '/merchants/45_mie_jebew', '/merchants/46_bakso_mie_cendana', '/merchants/47_geprek_dallas', '/merchants/48_seblak_alumni', '/merchants/49_ayam_bebek_pak_joko', '/merchants/50_naspad_urang_awak',
				'/merchants/51_madams_churros', '/merchants/52_ketoprak_bang_torro', '/merchants/53_lawson_uns', '/merchants/54_naspad_jembatan_merah_bundo_ayu', '/merchants/55_naspad_jembatan_biru_cahayo_minang', '/merchants/56_mixue_uns', '/merchants/57_hokage_crepes', '/merchants/58_mie_ayam_bakso_tinton', '/merchants/59_kantin_mbak_candra', '/merchants/60_selat_laras',
				'/merchants/61_ayam_tulang_lunak_bengawan', '/merchants/62_umie_solo', '/merchants/63_ayam_bakar_cah_solo', '/merchants/64_martabak_serdadoe', '/merchants/65_knk_chikcen_and_burger', '/merchants/66_burjo_way_way', '/merchants/67_warung_bu_tarti', '/merchants/68_mojjachi_uns', '/merchants/69_king_stars_kebab', '/merchants/70_sate_kambing_muda_kondang_laris', 
				'/merchants/71_tahu_gower', '/merchants/72_warung_lotek_gado_gado_bu_warni', '/merchants/73_pisang_comel_x_seblak_comel_uns', '/merchants/74_warung_espe', '/merchants/75_sambal_layah_bu_warni', '/merchants/76_warung_markotobz', '/merchants/77_warung_pbs_uns', '/merchants/78_huhah', '/merchants/79_mie_ayam_santai', '/merchants/80_wontoniki', 
				'/merchants/81_mie_ayam_bakso_pak_slamet', '/merchants/82_tweety_fried_chicken_uns', '/merchants/83_muramen_uns', '/merchants/84_mie_tentrem', '/merchants/85_mie_yamin_chapoo', '/merchants/86_fu_bao_kopitiam', 
				'/merchants/ums_1_ayam_penyet_pio','/merchants/ums_2_flavfour','/merchants/ums_3_kumlot','/merchants/ums_4_lapak_chicken','/merchants/ums_5_bago_hot_chicken','/merchants/ums_6_umayumcha','/merchants/ums_7_bakso_mblenger','/merchants/ums_8_flaseven','/merchants/ums_9_preksu','/merchants/ums_10_syafina_chicken',
				'/merchants/ums_11_seblak_bageur_2','/merchants/ums_12_warung_mas_itong','/merchants/ums_13_momoyo','/merchants/ums_14_dadar_beredar','/merchants/ums_15_salad_nyoo','/merchants/ums_16_brownis_cinta',
			],
		}
	}
};

export default config;
