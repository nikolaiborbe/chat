<script lang="ts">
	import Chatbox from './../components/Chatbox.svelte';
	import RenderMessage from '../components/RenderMessage.svelte';
	import type { Message, Model } from './types';

	const models: Model[] = [
		{ model: 'gpt-3.5-turbo', company: 'openai' },
		{ model: 'gpt-4', company: 'openai' },
		{ model: 'gpt-4-32k', company: 'openai' },
		{ model: 'o4-mini', company: 'openai' },
		{ model: "gemini-2.0-flash", company: "deepmind" },
	];

	let user_message = $state('');
	let model = $state(models[0]);
	let user = 'Nikolai G. Borbe';

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
				model: model
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
				user: model.model,
				time: new Date().toLocaleTimeString(),
				content: reply
			}
		];
	}
</script>

{#snippet chat(message: Message)}
	{#if message.user !== user}
		<div class="flex flex-col w-full items-start justify-start m-2 p-4">
			<div class="flex flex-col rounded-3xl text-white md:w-3/4">
				<RenderMessage message={message.content} />
			</div>
			<p class="flex text-sm text-gray-500">{message.user} · {message.time}</p>

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
	<div class="mb-20 pb-40">
		{#each messages as message}
			{@render chat(message)}
		{/each}
	</div>

	<div class="flex w-full justify-center">
		<Chatbox {onSubmit} {handleKeyDown} {models} bind:model bind:user_message />
	</div>
</div>
