<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class=" w-full h-screen ">
	<div class="p-4 lg:max-w-4xl mx-auto h-screen">

		{@render children()}
	</div>

</div>
