# Napvera website

Company website for **Napvera**, a food and beverage import and distribution company based at Mhd Ibn Kasem Althakafi St., Building 21, Damascus, Syria.

A static site: plain HTML, CSS and a few lines of JavaScript. No build step. Open `index.html` in a browser, or host the folder on any static host (GitHub Pages, Netlify, etc.).

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

The form in the Contact section is ready for a backend. Until one is connected, pressing **Send message** opens the visitor's email app with the message filled in, addressed to info@napvera.com.

To connect a backend, edit the `<form id="contact-form">` tag in `index.html`:

```html
<form class="contact-form" id="contact-form"
      action="https://your-endpoint.example.com/contact" method="post"
      data-endpoint="https://your-endpoint.example.com/contact" novalidate>
```

(also remove `enctype="text/plain"`). `js/main.js` then sends a `POST` with `FormData` and an `Accept: application/json` header. Any 2xx response shows "Message sent"; anything else shows an error and asks the visitor to email instead.

Fields sent: `name`, `company`, `email`, `phone`, `type` (Brand or supplier / Wholesaler or retailer / Other), `message`.
A hidden `website` field is a spam trap: it is never sent, and submissions where a bot filled it are dropped in the browser. Validate and rate-limit on the server too.

Works with form services such as Formspree, Getform or Basin (paste their endpoint URL), or your own API.

**Important:** the site sends a strict Content-Security-Policy (in `vercel.json`). When you connect a backend, add its origin to `connect-src` and `form-action`, for example `connect-src 'self' https://your-endpoint.example.com; form-action 'self' mailto: https://your-endpoint.example.com`. Otherwise the browser will block the request.

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
