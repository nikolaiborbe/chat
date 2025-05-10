<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, SubmitFunction } from './$types.js';
	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();

	let loading = $state(false);

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			update();
			loading = false;
		};
	};
</script>

<svelte:head>
	<title>User Management</title>
</svelte:head>

<div class="flex h-screen w-full items-center justify-center">
	<div class=" h-82 w-96 rounded-3xl p-4 outline-2">
		<form class="row flex-center flex h-full" method="POST" use:enhance={handleSubmit}>
			<div class="form-widget col-6 flex flex-col justify-between">
				<p class="description text-2xl">Sign in via magic link with your email below</p>
				{#if form?.message !== undefined}
					<div class="success {form?.success ? '' : 'fail'}">
						{form?.message}
					</div>
				{/if}
				<div>
					<div class="flex flex-col">
						<input
							class="inputField mt-1 rounded-full p-2 px-4 outline focus:outline-white"
							id="email"
							name="email"
							type="email"
							placeholder="Your email"
							value={form?.email ?? ''}
						/>
					</div>
					{#if form?.errors?.email}
						<span class="error flex items-center text-sm">
							{form?.errors?.email}
						</span>
					{/if}
					<div>
						<button class="button rounded-full p-2 px-4 outline mt-3 bg-white text-black hover:bg-transparent hover:text-white cursor-pointer transition w-full primary block">
							{loading ? 'Loading' : 'Send magic link'}
						</button>
					</div>
				</div>
			</div>
		</form>
	</div>
</div>
