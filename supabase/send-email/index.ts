// supabase/functions/send-email/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

serve(async (req) => {
  try {
    const { to, subject, message } = await req.json();

    if (!to || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'Campos obrigatórios ausentes.' }),
        { status: 400 }
      );
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'sistema@fertilagrícola.com',
        to,
        subject,
        html: `<p>${message}</p>`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify(data), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, data }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
});
