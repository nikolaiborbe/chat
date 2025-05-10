<!-- src/routes/account/+page.svelte -->
<script lang="ts">
	import { dictionary } from './../../../.svelte-kit/generated/client/app.js';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	interface Form {
		fullName: string;
		username: string;
		website: string;
		avatarUrl: string;
		message?: string;
		success?: boolean;
	}

	let { data, form }: { data: any; form: Form } = $props();

	let { session, supabase, profile } = $derived(data);


	let profileForm: HTMLFormElement;
	let loading = $state(false);
  let fullName: string = profile?.full_name ?? ''
	let username: string = profile?.username ?? ''
	let website: string = profile?.website ?? ''

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async () => {
			loading = false;
		};
	};

	const handleSignOut: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			update();
		};
	};
</script>

<div class="flex h-screen w-full items-center justify-center">
	<div class="h-96 w-96 rounded-3xl p-4 outline-2">
    <h1 class="text-2xl">Account</h1>
    {#if form?.message !== undefined}
      <div class="success {form?.success ? '' : 'fail'}">
        {form?.message}
      </div>
    {/if}
		<div class="h-full  flex flex-col justify-between">
		<form
			class="form-widget flex flex-col gap-2 pt-4"
			method="post"
			action="?/update"
			use:enhance={handleSubmit}
			bind:this={profileForm}
		>
				<div>
					<input id="email" class="w-full outline rounded-lg p-2 px-4" placeholder="email" type="text" value={session.user.email} disabled />
				</div>

				<div>
					<input id="fullName" class="w-full outline rounded-lg p-2 px-4" placeholder="Full name" name="fullName" type="text" value={form?.fullName ?? fullName} />
				</div>

				<div>
					<input id="username" class="w-full outline rounded-lg p-2 px-4" placeholder="username"  name="username" type="text" value={form?.username ?? username} />
				</div>

				<div>
					<input id="website" class="w-full outline rounded-lg p-2 px-4" placeholder="website" name="website" type="url" value={form?.website ?? website} />
				</div>

			</form>

			<form method="post" action="?/signout" use:enhance={handleSignOut}>
					<input
						type="submit"
						class="button outline w-full p-2 px-4 rounded-full hover:bg-white hover:text-black cursor-pointer transition block"
						value={loading ? 'Loading...' : 'Update'}
						disabled={loading}
					/>
				<div>
					<button class="button outline w-full mb-10 mt-4 p-2 px-4 rounded-full hover:bg-white hover:text-black cursor-pointer transition block" disabled={loading}>Sign Out</button>
				</div>
			</form>
		</div>
	</div>
</div>
