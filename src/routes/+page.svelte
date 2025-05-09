<script lang="ts">
	import Chatbox from './../components/Chatbox.svelte';
	import RenderMessage from '../components/RenderMessage.svelte';

	const models = ["gpt-3.5-turbo", "gpt-4", "gpt-4-32k", "o4-mini"];

	let user_message = $state('');
	let model = $state(models[0]);
	let user = 'Nikolai G. Borbe';

	type Message = {
		user: string | 'AI';
		time: string;
		content: string;
	};

	let messages: Message[] = $state([]);


	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			onSubmit(event);
		}
	}

	async function onSubmit(event: Event) {
		event.preventDefault();
		if (user_message.trim() === '') return;
		let msg = user_message;
		user_message = '';

		messages = [
			...messages,
			{
				user: user,
				time: new Date().toLocaleTimeString(),
				content: msg
			}
		];

		const res = await fetch('/api/get-message/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				message: msg,
				model: model,
			})
		});

		const { reply, error } = await res.json();
		if (error) {
			console.error(error);
			return;
		}

		messages = [
			...messages,
			{
				user: 'AI',
				time: new Date().toLocaleTimeString(),
				content: reply
			}
		];
	}
</script>



{#snippet chat(message: Message)}
	{#if message.user === 'AI'}
		<div class="flex w-full justify-start">
			<div class="m-2 flex md:w-3/4 flex-col rounded-3xl p-4 text-white">
				<RenderMessage message={message.content} />
			</div>
		</div>
	{:else}
		<div class="flex w-full justify-end">
			<div class="m-2 flex w-fit min-w-10 flex-col rounded-4xl bg-[#303030] px-5 py-3 text-white">
				<RenderMessage message={message.content} />
			</div>
		</div>
	{/if}
{/snippet}

<div class="flex h-full flex-col place-content-between">
	<div class="pb-40 mb-20">
		{#each messages as message}
			{@render chat(message)}
		{/each}
	</div>

	<div class="flex justify-center w-full ">
		<Chatbox {onSubmit} {handleKeyDown} {models} bind:model bind:user_message />

	</div>
</div>
