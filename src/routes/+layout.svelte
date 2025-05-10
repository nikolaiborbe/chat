<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation'
	import { onMount } from 'svelte'

	let {data, children} = $props();

	let { supabase, session } = $derived(data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth')
			}
		})
		return () => data.subscription.unsubscribe()
	})

</script>

<div class=" w-full h-screen">
	<div class="p-4 lg:max-w-4xl mx-auto h-screen">

		{@render children()}
	</div>

</div>
