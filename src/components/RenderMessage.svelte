<script lang="ts">
  import katex from 'katex';
  import 'katex/dist/katex.min.css';

  /**
   * Render a message that mixes minimal Markdown, KaTeX inline / block math
   * and now simple dash‑style lists.
   */
  export let message: string;

  type Part =
    | { type: 'text'; content: string }
    | { type: 'inline'; content: string }
    | { type: 'block'; content: string };

  // $$ … $$ | \[ … \] (block)   OR   \( … \) | $ … $ (inline)
  const mathRegex = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)|\$([\s\S]+?)\$/g;

  /** Split the incoming message into renderable parts */
  $: parts = (() => {
    const res: Part[] = [];
    let last = 0;
    let m: RegExpExecArray | null = null;
    mathRegex.lastIndex = 0;
    while ((m = mathRegex.exec(message)) !== null) {
      if (m.index > last) res.push({ type: 'text', content: message.slice(last, m.index) });
      if (m[1] != null)       res.push({ type: 'block',  content: m[1] });
      else if (m[2] != null)  res.push({ type: 'block',  content: m[2] });
      else if (m[3] != null)  res.push({ type: 'inline', content: m[3] });
      else if (m[4] != null)  res.push({ type: 'inline', content: m[4] });
      last = mathRegex.lastIndex;
    }
    if (last < message.length) res.push({ type: 'text', content: message.slice(last) });
    return res;
  })();

  /* ------------------------------------------------------------------ */
  /*                Minimal Markdown → HTML utilities                   */
  /* ------------------------------------------------------------------ */
  function escapeHtml(str: string) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /** Convert a small subset of Markdown to HTML. Supports:
   *  • Headings              # … ######
   *  • Unordered lists       - item
   *  • Inline code           `code`
   *  • Bold / Italic         **bold**, *italic*
   */
  function md2html(str: string) {
    let s = escapeHtml(str);

    // ----- Headings ----------------------------------------------------
    s = s.replace(/^####\s+(.+)$/gm,  '<h4 class="text-xl pt-4 pb-1">$1</h4>');
    s = s.replace(/^###\s+(.+)$/gm,   '<h3 class="text-2xl pt-4 pb-1">$1</h3>');
    s = s.replace(/^##\s+(.+)$/gm,    '<h2 class="text-3xl pt-4 pb-1">$1</h2>');
    s = s.replace(/^#\s+(.+)$/gm,     '<h1 class="text-4xl pt-4 pb-1">$1</h1>');

    // ----- Unordered list items ---------------------------------------
    // Each dash‑prefixed line becomes its own bullet div so that it
    // naturally breaks onto a new line.
    s = s.replace(/^\s*-\s+(.+)$/gm, '<div class="ml-4">&bull; $1</div>');

    // ----- Inline code -------------------------------------------------
    s = s.replace(/`([^`\n]+)`/g, '<code>$1</code>');

    // ----- Bold & Italic ---------------------------------------------
    s = s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    s = s.replace(/\*(.+?)\*/g, '<i>$1</i>');

    return s;
  }

  /** Determine if a raw line should be rendered as block‑level */
  function isBlockLine(str: string) {
    return /^\s*#{1,6}\s+/.test(str) || /^\s*-\s+/.test(str);
  }
</script>

<!-- ------------------------------------------------------------------ -->
<!--                           Mark‑up                                  -->
<!-- ------------------------------------------------------------------ -->
<div>
  {#each parts as part}
    {#if part.type === 'text'}
      {#if isBlockLine(part.content)}
        <!-- Headings and list bullets get block treatment -->
        <div>{@html md2html(part.content)}</div>
      {:else}
        <!-- Regular inline text -->
        <span>{@html md2html(part.content)}</span>
      {/if}

    {:else if part.type === 'inline'}
      <span class="align-middle">
        {@html katex.renderToString(part.content, {
          displayMode: false,
          throwOnError: false
        })}
      </span>

    {:else}
      <!-- Block math -->
      <div class="my-4 flex justify-center">
        {@html katex.renderToString(part.content, {
          displayMode: true,
          throwOnError: false
        })}
      </div>
    {/if}
  {/each}
</div>
