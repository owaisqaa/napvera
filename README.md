# Napvera website

Company website for **Napvera**, a food and beverage import and distribution company based at Maisat Square, Damascus, Syria.

A static site: plain HTML, CSS and a few lines of JavaScript. No build step. Open `index.html` in a browser, or host the folder on any static host (GitHub Pages, Netlify, etc.).

Live at https://www.napvera.com (Vercel, deploys automatically from the `main` branch).

## Structure

```
index.html              The page (SEO meta, social tags and structured data are in <head>)
404.html                Page shown for unknown URLs
robots.txt, sitemap.xml For search engines
site.webmanifest        App name, colours and icons
favicon.ico             Browser tab icon (older browsers)
vercel.json             Clean URLs, security headers, caching
.vercelignore           Keeps this README off the live site
css/style.css           Styles (colour tokens at the top)
js/main.js              Footer year, header border on scroll, contact form
assets/
  napvera-logo.svg        Logo, navy (for light backgrounds)
  napvera-logo-white.svg  Logo, white (for dark backgrounds)
  napvera-logo-lockup.svg Logo with "Import & Distribution" tagline
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

- **Mumlar logo and link:** in `index.html`, find the comment above the Mumlar tile. Add the logo file to `assets/` and swap the text wordmark for an `<img>`. When the website is ready, change the tile's `<div class="company">` to `<a class="company company-link" href="..." target="_blank" rel="noopener">`.
- **Contact details:** the email (`info@napvera.com`) and address are in the Contact section of `index.html` and in the JSON-LD block in the `<head>`.
- **Colours:** edit the variables in `:root` at the top of `css/style.css`.
