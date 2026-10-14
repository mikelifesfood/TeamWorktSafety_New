TEAMWORKT SAFETY PUBLIC SALES SITE

PURPOSE
This repository is the public TeamWorkt Safety marketing website. It is intentionally separated from the protected interactive sales demo. The public repository contains marketing content, the walkthrough-interest contact endpoint, and static product preview images only.

PUBLIC FILES
index.html                         Public one-page marketing website.
api/contact.js                     Server-side Vercel contact endpoint using the BREVO_API_KEY environment variable.
assets/previews/                   Static screenshots used for product previews.
service-worker.js                  Public-site cache limited to approved marketing assets.
site.webmanifest                   Public-site/PWA metadata.
assets/                            Logos, icons, hero art, and other public marketing assets.

INTENTIONALLY NOT INCLUDED
The following interactive demo files must not be stored or deployed from this public repository:
- dashboard.html
- report.html
- demo.html
- demo-db.js

The interactive sales demo is maintained separately in the private TeamWorktSafety-Private-Demo repository and protected through Cloudflare Access.

STATIC PRODUCT PREVIEWS
The homepage uses PNG screenshots under assets/previews. These images are non-interactive and contain sample/demo information only. They do not connect to a database and cannot be used to submit reports or open the management dashboard.

CONTACT FORM / BREVO
The walkthrough form submits asynchronously to /api/contact and remains on the TeamWorkt Safety website.

Required Vercel environment variable:
- BREVO_API_KEY = Brevo transactional email API key

Notification behavior:
- Form notifications are sent to hello@teamworktsafety.com.
- The prospect's submitted work email is set as Reply-To.
- Successful submissions display an on-page confirmation.
- A hidden honeypot field and server-side validation provide basic spam protection.

SECURITY RULE
Never place service-role keys, API secrets, database passwords, Brevo keys, Cloudflare tokens, or other credentials in this repository. The BREVO_API_KEY belongs only in Vercel environment variables.

SALES RULE
Do not restore interactive demo files to the public repository. Use the protected private demo during qualified prospect walkthroughs.


SECURITY PAGE
- security.html is the public Security & Data Protection page.
- Security claims must remain factual and distinguish TeamWorkt controls from provider certifications.
- TeamWorkt Safety must not be described as SOC 2 audited/certified or ISO/IEC 27001 certified unless independent assurance is actually completed.

STEP 3 PRIVACY / TRUST UPDATE
- privacy.html is the public website privacy policy.
- terms.html is limited to public marketing-site terms; customer product use requires a separate customer agreement.
- Footer trust links should remain visible on index.html, security.html, privacy.html, and terms.html.
- The public contact form should continue linking to privacy.html near the submit button.
- Update the privacy policy whenever public data collection, analytics, vendors, or retention practices materially change.

SECURITY HEADERS (STEP 6)
-------------------------
Vercel response security headers are defined in vercel.json and apply site-wide.
The policy restricts content to TeamWorkt-owned resources plus the Google Fonts hosts already used by the marketing pages.
The contact form continues to POST only to the same-origin /api/contact endpoint; BREVO_API_KEY remains server-side.
Do not loosen the Content-Security-Policy when adding future third-party scripts unless the new source is reviewed and intentionally approved.


SITE REDESIGN (OCTOBER 2026)
----------------------------
All four public pages now share one stylesheet: assets/site.css. Page-level <style> blocks were removed.

Fonts (Google Fonts, already allowed by the CSP in vercel.json):
- Zilla Slab: headings
- Public Sans: body text
- Kalam: hand-written notes only (photo, paper-form and dashboard annotations)

Colors (flat, no gradients): navy #011840 (from the logo wordmark), safety yellow #f7c600,
ballpoint blue #1f5fd6 (hand-written notes only), paper #fbfaf6, manila #ece1c3, concrete gray #5b6370.

New assets:
- assets/jobsite-framing-crew.webp: the original hero photo with the baked-in blue fade cropped off.
- assets/teamworkt-safety-logo-trim.png: the original logo with empty margins trimmed, sized for the header.
The original teamworkt-construction-hero.webp and teamworkt-safety-logo.png are kept, unchanged.

Home page placeholder still to fill:
- "Who's behind it" section: dashed box marked "Photo to add". Replace with a real photo when one is available.

Policy pages: wording in security.html, privacy.html and terms.html is unchanged. Only the layout changed.
The 01-09 numbers on the security controls were dropped because the list is not a sequence.

Contact form: field names, IDs, honeypot, /api/contact endpoint and success/error handling are unchanged.
Service worker cache name bumped to v6 so returning visitors get the new files.
