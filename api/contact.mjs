// Contact form handler (Vercel function), sends each enquiry to info@napvera.com through Resend.
//
// Needs one environment variable in Vercel (Settings -> Environment Variables):
//   RESEND_API_KEY   a Resend API key with sending access to napvera.com
// napvera.com must be verified in Resend, or Resend will refuse the sender address below.

const TO = 'info@napvera.com';
const FROM = 'Napvera Website <website@napvera.com>';
const TYPES = ['Brand or supplier', 'Wholesaler or retailer', 'Other'];
const MAX_BODY = 20000; // bytes; the form's own limits add up to well under this
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Browsers send JSON-accepting requests from js/main.js; a plain form post (JavaScript off) gets a redirect instead.
function reply(request, status, error) {
  const wantsJson = (request.headers.get('accept') || '').includes('application/json');
  if (wantsJson) {
    return Response.json(status < 300 ? { ok: true } : { ok: false, error }, { status });
  }
  const page = status < 300 ? '/?sent=1#contact' : '/?sent=0#contact';
  return new Response(null, { status: 303, headers: { Location: page } });
}

// One line, trimmed, no control characters (keeps headers and the subject clean)
function line(value, max) {
  return String(value || '').replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, max);
}

// Multi-line text, trimmed, keeping line breaks
function text(value, max) {
  return String(value || '').replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '').trim().slice(0, max);
}

export async function POST(request) {
  // Only accept posts from this site
  const origin = request.headers.get('origin');
  if (origin) {
    const host = new URL(origin).host;
    if (host !== request.headers.get('host')) return reply(request, 403, 'forbidden');
  }

  if (Number(request.headers.get('content-length') || 0) > MAX_BODY) {
    return reply(request, 413, 'too_large');
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return reply(request, 400, 'bad_request');
  }

  // Spam trap: real visitors never fill the hidden "website" field. Pretend it worked.
  if (line(form.get('website'), 200)) return reply(request, 200);

  const name = line(form.get('name'), 100);
  const company = line(form.get('company'), 120);
  const email = line(form.get('email'), 160);
  const phone = line(form.get('phone'), 30);
  const type = TYPES.includes(form.get('type')) ? form.get('type') : 'Other';
  const message = text(form.get('message'), 2000);

  if (!name || !message || !EMAIL_RE.test(email)) {
    return reply(request, 422, 'invalid');
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('contact: RESEND_API_KEY is not set');
    return reply(request, 500, 'not_configured');
  }

  const subject = 'New enquiry: ' + type + ', from ' + name + (company ? ' (' + company + ')' : '');
  const body = [
    'Name: ' + name,
    'Company: ' + (company || '-'),
    'Email: ' + email,
    'Phone: ' + (phone || '-'),
    'I am a: ' + type,
    '',
    message,
    '',
    '--',
    'Sent from the contact form on napvera.com. Reply to this email to answer ' + name + ' directly.'
  ].join('\n');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to: [TO], reply_to: email, subject, text: body })
    });
    if (!res.ok) {
      console.error('contact: Resend replied', res.status, await res.text());
      return reply(request, 502, 'send_failed');
    }
  } catch (err) {
    console.error('contact: could not reach Resend', err);
    return reply(request, 502, 'send_failed');
  }

  return reply(request, 200);
}
