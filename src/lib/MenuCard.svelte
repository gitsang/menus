<script lang="ts">
	import type { MenuItem } from './types.js';

	interface Props {
		item: MenuItem;
	}

	let { item }: Props = $props();
</script>

<div class="rounded-lg border bg-white p-6 shadow-md">
	<div class="mb-4">
		{#if item.image}
			<img src={item.image} alt={item.name} class="mb-4 h-48 w-full rounded-md object-cover" />
		{:else}
			<div class="mb-4 flex h-48 w-full items-center justify-center rounded-md bg-gray-200">
				<span class="text-gray-500">No image available</span>
			</div>
		{/if}
	</div>

	<h3 class="mb-2 text-xl font-bold capitalize">{item.name}</h3>
	<p class="text-gray-600">
		<span class="font-medium">Ingredients:</span>
		{item.ingredients}
	</p>
</div>
