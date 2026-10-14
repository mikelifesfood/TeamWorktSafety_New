const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email';
const TO_EMAIL = 'hello@teamworktsafety.com';
const FROM_EMAIL = 'hello@teamworktsafety.com';
const FROM_NAME = 'TeamWorkt Safety Website';

function clean(value, maxLength = 500) {
  return String(value || '').trim().slice(0, maxLength);
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('BREVO_API_KEY is not configured.');
    return res.status(500).json({ ok: false, error: 'Contact service is not configured.' });
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_err) { body = {}; }
  }

  // Honeypot: silently accept bot submissions without sending an email.
  if (clean(body.website, 200)) {
    return res.status(200).json({ ok: true });
  }

  const name = clean(body.name, 120);
  const company = clean(body.company, 160);
  const email = clean(body.email, 254).toLowerCase();
  const phone = clean(body.phone, 60);
  const companySize = clean(body.company_size, 80);
  const message = clean(body.message, 3000);

  if (!name || !company || !email || !companySize) {
    return res.status(400).json({ ok: false, error: 'Please complete all required fields.' });
  }
  if (!validEmail(email)) {
    return res.status(400).json({ ok: false, error: 'Please enter a valid work email.' });
  }

  const subjectCompany = company.replace(/[\r\n]+/g, ' ').slice(0, 90);
  const subject = `New TeamWorkt Safety walkthrough request — ${subjectCompany}`;

  const textContent = [
    'New TeamWorkt Safety walkthrough request',
    '',
    `Name: ${name}`,
    `Company: ${company}`,
    `Work email: ${email}`,
    `Phone: ${phone || 'Not provided'}`,
    `Company size: ${companySize}`,
    '',
    'Message:',
    message || 'No message provided.',
    '',
    'Reply to this email to respond directly to the prospect.'
  ].join('\n');

  const htmlContent = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#102236;line-height:1.55;max-width:680px">
      <h2 style="margin:0 0 18px;color:#0a315d">New TeamWorkt Safety walkthrough request</h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        <tr><td style="padding:8px 10px;background:#f4f8fc;font-weight:700;width:150px">Name</td><td style="padding:8px 10px;border-bottom:1px solid #e1e8ef">${escapeHtml(name)}</td></tr>
        <tr><td style="padding:8px 10px;background:#f4f8fc;font-weight:700">Company</td><td style="padding:8px 10px;border-bottom:1px solid #e1e8ef">${escapeHtml(company)}</td></tr>
        <tr><td style="padding:8px 10px;background:#f4f8fc;font-weight:700">Work email</td><td style="padding:8px 10px;border-bottom:1px solid #e1e8ef"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding:8px 10px;background:#f4f8fc;font-weight:700">Phone</td><td style="padding:8px 10px;border-bottom:1px solid #e1e8ef">${escapeHtml(phone || 'Not provided')}</td></tr>
        <tr><td style="padding:8px 10px;background:#f4f8fc;font-weight:700">Company size</td><td style="padding:8px 10px;border-bottom:1px solid #e1e8ef">${escapeHtml(companySize)}</td></tr>
      </table>
      <div style="margin-top:18px;padding:16px;background:#f8fbfe;border:1px solid #e1e8ef;border-radius:10px">
        <div style="font-weight:700;margin-bottom:6px">Message</div>
        <div style="white-space:pre-wrap">${escapeHtml(message || 'No message provided.')}</div>
      </div>
      <p style="font-size:12px;color:#60758b;margin-top:18px">Reply to this email to respond directly to the prospect.</p>
    </div>`;

  try {
    const brevoResponse = await fetch(BREVO_ENDPOINT, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: FROM_NAME, email: FROM_EMAIL },
        to: [{ email: TO_EMAIL, name: 'TeamWorkt Safety' }],
        replyTo: { email, name },
        subject,
        textContent,
        htmlContent,
        tags: ['teamworkt-contact-form']
      })
    });

    if (!brevoResponse.ok) {
      const detail = await brevoResponse.text();
      console.error('Brevo send failed:', brevoResponse.status, detail.slice(0, 1000));
      return res.status(502).json({ ok: false, error: 'Email delivery failed.' });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Contact function failed:', error);
    return res.status(500).json({ ok: false, error: 'Unable to send request.' });
  }
};
