<script lang="ts">
	import katex from 'katex';
	import 'katex/dist/katex.min.css';

	/** the full text that may contain `$begin:math:text$...$end:math:text$` math segments */
	let { message } = $props();

	// split on the inline delimiters, but keep what's inside ()
	// the capturing group ( ... ) ensures the math content appears in the parts array
	type Part =
		| { type: 'text'; content: string }
		| { type: 'inline'; content: string }
		| { type: 'block'; content: string };

	// regex that finds $$…$$ or \[…\] or \(...\) or $…$
	const mathRegex = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)|\$([\s\S]+?)\$/g;

	// whenever message changes, recompute the parts array
	let parts = $derived(
		(() => {
			const res: Part[] = [];
			let last = 0;
			let m: RegExpExecArray | null = null;
			while ((m = mathRegex.exec(message)) !== null) {
				if (m.index > last) {
					res.push({ type: 'text', content: message.slice(last, m.index) });
				}
				if (m[1] != null) res.push({ type: 'block', content: m[1] });
				else if (m[2] != null) res.push({ type: 'block', content: m[2] });
				else if (m[3] != null) res.push({ type: 'inline', content: m[3] });
				else if (m[4] != null) res.push({ type: 'inline', content: m[4] });
				last = mathRegex.lastIndex;
			}
			if (last < message.length) res.push({ type: 'text', content: message.slice(last) });
			return res;
		})()
	);

	function escapeHtml(str: string) {
		return str
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}

	function md2html(str: string) {
		let s = escapeHtml(str);

		// code spans: `code`
		s = s.replace(/`([^`\n]+)`/g, '<code>$1</code>');
		// bold: **bold**
		s = s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
		// italic: *italic*
		s = s.replace(/\*(.+?)\*/g, '<i>$1</i>');
		// you can add more rules here...

		return s;
	}
</script>

<div>
	{#each parts as part}
		{#if part.type === 'text'}
			<!-- apply markdown → HTML -->
			<span>{@html md2html(part.content)}</span>
		{:else if part.type === 'inline'}
			<span class="align-middle">
				{@html katex.renderToString(part.content, {
					displayMode: false,
					throwOnError: false
				})}
			</span>
		{:else}
			<div class="my-4 flex justify-center">
				{@html katex.renderToString(part.content, {
					displayMode: true,
					throwOnError: false
				})}
			</div>
		{/if}
	{/each}
</div>
