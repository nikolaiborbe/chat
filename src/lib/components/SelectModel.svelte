<script lang="ts">
  import { onMount } from "svelte";
	let { models, model = $bindable() } = $props();
	import type { Model } from "$lib/types/types";

	let current_model: Model = $derived(model);
	let open = $state(false);

	function handleClick() {
		open = !open;
	}

  onMount(() => {
    model = models[0];
  })
</script>

<div bind:this={model} class="">

	{#if open}
		<div class="flex outline flex-col bg-[#303030] outline-[#424242] rounded-2xl mb-2 p-2">
			{#each models as m}
				<button 
        class="hover:bg-[#424242] cursor-pointer rounded-xl p-1 px-4 "
					onclick={() => {
						model = m;
						open = false;
					}}
				>
					{m.model}
				</button>
			{/each}
		</div>
	{/if}

	<button
		onclick={handleClick}
		class="mx-2 cursor-pointer rounded-full p-1 px-4 outline outline-[#424242]"
	>
		{current_model.model}
	</button>
</div>
