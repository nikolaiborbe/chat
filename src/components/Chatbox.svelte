<script lang="ts">
	import Submit from './icons/Submit.svelte';
	import SelectModel from './SelectModel.svelte';

	let { onSubmit, handleKeyDown, user_message = $bindable(), model = $bindable(), models} = $props();
</script>

<div class="
    fixed bottom-4 
    left-4 right-4           
		mx-auto
    lg:max-w-3xl               
    h-28 rounded-3xl 
    bg-[#303030] outline outline-[#424242]
  ">
	<textarea
		bind:value={user_message}
		onkeydown={handleKeyDown}
		id="chat_input"
		placeholder="What's on your mind?"
		required
    wrap="soft"
		class="p-4 resize-none outline-none overflow-hidden scroll-none w-full h-full"
	>
</textarea>
<div class="absolute top-0 right-0 p-3"> <Submit {onSubmit}/> </div>
<div class="absolute bottom-0 left-0 py-2 "> <SelectModel {models}  bind:model/> </div>

</div>
