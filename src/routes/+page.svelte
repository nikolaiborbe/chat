<script lang="ts">
	import Chatbox from './../components/Chatbox.svelte';
	import RenderMessage from '../components/RenderMessage.svelte';
	import type { Message, Model } from './types';

	let bottomAnchor: HTMLDivElement;
	$effect(() => {
		messages.length;      // dependency tracking
		bottomAnchor?.scrollIntoView({ behavior: 'smooth' });
	});

	const models: Model[] = [
		{ model: 'gemini-2.0-flash', company: 'deepmind' },
		{ model: 'o4-mini', company: 'openai' },
		{ model: 'gpt-4o', company: 'openai' },
		{ model: 'o3', company: 'openai' },
		{ model: 'deepseek-chat', company: 'deepseek' },
		{ model: 'deepseek-reasoner', company: 'deepseek' },
	];

	let user_message = $state('');
	let model = $state(models[0]);
	let user = 'Nikolai G. Borbe';
	let display_blob = $state(false);

	// scroll to the bottom every time the list changes

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

		display_blob = true;
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
		display_blob = false;
	}
</script>

{#if !messages.length}
	<div class="absolute top-1/2 left-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center text-center">
		<p>No history, no memories. Just chat.</p>
	</div>

{/if}

{#snippet chat(message: Message)}
	{#if message.user !== user}
		<div class="m-2 flex w-full flex-col items-start justify-start">
			<div class="flex flex-col rounded-3xl text-white md:w-3/4">
				<RenderMessage message={message.content} />
			</div>
			<p class="flex text-sm text-gray-500">{message.user} · {message.time}</p>
		</div>
	{:else}
		<div class="flex w-full justify-end">
			<div class="m-2 flex w-fit min-w-10 flex-col md:max-w-3/4 rounded-4xl bg-[#303030] outline outline-[#363636] px-5 py-3 text-white">
				<RenderMessage message={message.content} />
			</div>
		</div>
	{/if}
{/snippet}

<div class="flex h-full flex-col place-content-between">
	<div  class="mb-20 pb-40 flex-1 flex-col">
		{#if messages.length <= 2}
			<div bind:this={bottomAnchor}></div> 
		{/if}
		{#each messages as message}
			{@render chat(message)}
		{/each}
		{#if display_blob}
			<div class="m-4 h-3 w-3 animate-pulse rounded-full bg-white"></div>
		{/if}
		{#if messages.length > 2}
			<div bind:this={bottomAnchor}></div>
		{/if}
	</div>

	<div class="flex w-full justify-center">
		<Chatbox {onSubmit} {handleKeyDown} {models} bind:model bind:user_message />
	</div>
</div>
