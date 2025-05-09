// src/routes/api/get-message/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { OPENAI_API_KEY } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
  const { message, model } = await request.json() as
    { message?: string; model?: string };

  if (!message) {
    return new Response(
      JSON.stringify({ error: 'No message provided' }),
      { status: 400 }
    );
  }

  const modelToUse = model ?? 'gpt-4o';

  // call OpenAI
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: modelToUse,    // or whichever model you want
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message }
      ]
    })
  });

  if (!res.ok) {
    const err = await res.json();
    return new Response(
      JSON.stringify({ error: err }),
      { status: res.status }
    );
  }

  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content ?? '';

  return new Response(
    JSON.stringify({ reply }),
    { headers: { 'Content-Type': 'application/json' } }
  );
};