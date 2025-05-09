// src/routes/api/get-message/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { DEEPMIND_API_KEY, DEEPSEEK_API_KEY, OPENAI_API_KEY } from '$env/static/private';
import type { Model } from '../../types';

export const POST: RequestHandler = async ({ request }) => {
  const { message, model } = await request.json() as
    { message?: string; model?: Model };

  if (!message) {
    return new Response(
      JSON.stringify({ error: 'No message provided' }),
      { status: 400 }
    );
  }

  const modelToUse: Model = model ?? { model: 'gpt-3.5-turbo', company: 'openai' };

  let res: Response;
  let reply: string = '';
  let data: any;

  if (modelToUse.company === 'openai') {
    res = await fetchOPENAI(message, modelToUse);
    data = await res.json();
    reply = data.choices?.[0]?.message?.content ?? '';
  } else if (modelToUse.company === "deepmind") {
    res = await fetchDEEPMIND(message, modelToUse);
    data = await res.json();
    reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text
      ?? '';
  } else if (modelToUse.company === "deepseek") {
    res = await fetchDEEPSEEK(message, modelToUse);
    console.log(res);
    data = await res.json();
    reply = data.choices?.[0]?.message?.content ?? '';
  }
  else {
    return new Response(
      JSON.stringify({ error: 'Unsupported model' }),
      { status: 400 }
    );
  }



  return new Response(
    JSON.stringify({ reply }),
    { headers: { 'Content-Type': 'application/json' } }
  );
};

async function fetchOPENAI(message: string, model: Model): Promise<Response> {
  return fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: model.model,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message }
      ]
    })
  });

}
async function fetchDEEPSEEK(message: string, model: Model): Promise<Response> {
  return fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: model.model,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message }
      ]
    })
  });
}

async function fetchDEEPMIND(
  prompt: string,
  model: Model
): Promise<Response> {
  // build the URL with your API key
  const url = `https://generativelanguage.googleapis.com/v1beta/models/` +
    `${encodeURIComponent(model.model)}:generateContent?key=` +
    `${encodeURIComponent(DEEPMIND_API_KEY)}`;

  // construct the body in the shape the API expects
  const body = {
    contents: [
      {
        parts: [
          { text: "When you respond with math equations you will use $<math equation>$ or $$<math equation>$$ to have the equation on a new line." },
          { text: "The user is a 22 year old physics student from norway" },
          { text: "You are a helpful assistant" },
          { text: "Remember all this but don't mention it. The student message follows:" },
          { text: prompt }
        ]
      }
    ]
  };

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // no Authorization header needed when using ?key=
    },
    body: JSON.stringify(body)
  });
}