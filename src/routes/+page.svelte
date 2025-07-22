<script lang="ts">
	import { onMount } from 'svelte';
	import { loadMenuConfig } from '$lib/config.js';
	import MenuCard from '$lib/MenuCard.svelte';
	import type { MenuConfig } from '$lib/types.js';

	let config = $state<MenuConfig | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		try {
			config = await loadMenuConfig();
		} catch (err) {
			error = 'Failed to load menu configuration';
			console.error(err);
		} finally {
			loading = false;
		}
	});
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-center text-4xl font-bold">Menu</h1>

	{#if loading}
		<div class="text-center">
			<p class="text-gray-600">Loading menu...</p>
		</div>
	{:else if error}
		<div class="text-center">
			<p class="text-red-500">{error}</p>
		</div>
	{:else if config}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each config.menus as item (item.name)}
				<MenuCard {item} />
			{/each}
		</div>
	{/if}
</div>
