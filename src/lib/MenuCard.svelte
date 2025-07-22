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
			<img
				src={item.image}
				alt={item.name}
				class="mb-4 aspect-square w-full rounded-md object-cover"
			/>
		{:else}
			<div
				class="mb-4 flex aspect-square w-full items-center justify-center rounded-md bg-gray-200"
			>
				<span class="text-gray-500">No image available</span>
			</div>
		{/if}
	</div>

	<div class="mb-2 flex items-start justify-between">
		<h3 class="text-xl font-bold capitalize">{item.name}</h3>
		<span class="text-lg font-bold text-green-600">{item.price}</span>
	</div>
	<p class="text-gray-600">
		{item.ingredients}
	</p>
</div>
