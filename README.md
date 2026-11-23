# Napvera website

Company website for **Napvera**, a food and beverage import and distribution company based at Mhd Ibn Kasem Althakafi St., Building 21, Damascus, Syria.

A static site: plain HTML, CSS and a few lines of JavaScript, plus one Vercel function for the contact form. No build step. Open `index.html` in a browser to preview it (the form only sends on Vercel).

Live at https://www.napvera.com (Vercel, deploys automatically from the `main` branch).

## Structure

```
index.html              The home page (SEO meta, social tags and structured data are in <head>)
brands.html             Brands page (www.napvera.com/brands): our own brand Levant, then the brands we carry, with origin and history
404.html                Page shown for unknown URLs
robots.txt, sitemap.xml For search engines
site.webmanifest        App name, colours and icons
favicon.ico             Browser tab icon (older browsers)
vercel.json             Clean URLs, security headers, caching
.vercelignore           Keeps this README off the live site
css/style.css           Styles (colour tokens at the top)
js/main.js              Footer year, header border on scroll, contact form
api/contact.mjs         Vercel function that emails contact form messages through Resend
assets/
  napvera-logo.png        Logo, navy (for light backgrounds)
  napvera-logo-white.png  Logo, white (for dark backgrounds)
  napvera-logo-lockup.png, napvera-logo-lockup-white.png   Logo with "Import & Distribution" tagline
  brands/                 Brand logos for the Brands page (.webp, about 440px wide)
  favicon.svg             Browser tab icon
  og-image.png            Preview image when the link is shared (1200x630)
  apple-touch-icon.png, icon-192.png, icon-512.png   Home-screen icons
  fonts/                  Archivo font, self-hosted (SIL Open Font License)
  map-base.svg            Background map for the hero
  port-scene.svg          Faint port illustration along the bottom of the hero
  swenap-logo.png         Swenap logo (links to swenap.com)
```

## Contact form

Messages from the Contact section are emailed to info@napvera.com through [Resend](https://resend.com).

- `js/main.js` POSTs the form (`FormData`, `Accept: application/json`) to `/api/contact`. A 2xx response shows "Message sent"; anything else shows an error and asks the visitor to email instead.
- `api/contact.mjs` is a Vercel function. It checks the fields again, drops spam (the hidden `website` field), and sends the email **from** `website@napvera.com` **to** `info@napvera.com` with **Reply-To set to the visitor**, so pressing Reply answers them directly.
- Fields: `name`, `company`, `email`, `phone`, `type` (Brand or supplier / Wholesaler or retailer / Other), `message`.

Setup (once):

1. In Resend, add and verify the domain `napvera.com` (add the DNS records Resend shows). This doesn't affect the info@napvera.com inbox.
2. In Resend, create an API key with sending access to napvera.com.
3. In Vercel → project → Settings → Environment Variables, add `RESEND_API_KEY` with that key (Production, and Preview if wanted), then redeploy.

If messages stop arriving, check the function logs in Vercel (Logs → `/api/contact`); errors from Resend are logged there. To change the recipient or sender, edit `TO` and `FROM` at the top of `api/contact.mjs`.

The form posts to the same site, so the Content-Security-Policy in `vercel.json` needs no changes. To go back to the email-app fallback, empty `data-endpoint` on the form in `index.html`.

## Updating SEO

- When content changes, update `<lastmod>` in `sitemap.xml`.
- The canonical address is `https://www.napvera.com/` (napvera.com redirects there).
- To change the share preview, replace `assets/og-image.png` (keep 1200x630).

## To update

- **Brands page:** to add a brand, put its logo in `assets/brands/` (transparent or white background, about 440px wide) and copy one `<li class="brand-card">` in `brands.html` (logo, name, origin line, short history). Levant, our own brand, has its own featured box at the top.
- **Mumlar logo and link:** in `index.html`, find the comment above the Mumlar tile. Add the logo file to `assets/` and swap the text wordmark for an `<img>`. When the website is ready, change the tile's `<div class="company">` to `<a class="company company-link" href="..." target="_blank" rel="noopener">`.
- **Contact details:** the email (`info@napvera.com`), phone numbers (TR +90 545 905 71 57, SY +963 944 231 885) and address are in the Contact section of `index.html` and in the JSON-LD block in the `<head>`.
- **Colours:** edit the variables in `:root` at the top of `css/style.css`.
- **After changing `css/style.css`:** raise the number in `style.css?v=5` (in `index.html`, `brands.html` and `404.html`) so visitors' browsers load the new styles instead of an old saved copy.
