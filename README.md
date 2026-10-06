# Napvera website

Company website for **Napvera**, a food and beverage import and distribution company based at Maisat Square, Damascus, Syria.

A static site: plain HTML, CSS and a few lines of JavaScript. No build step. Open `index.html` in a browser, or host the folder on any static host (GitHub Pages, Netlify, etc.).

## Structure

```
index.html              The page
css/style.css           Styles (colour tokens at the top)
js/main.js              Footer year + header border on scroll
assets/
  napvera-logo.svg        Logo, navy (for light backgrounds)
  napvera-logo-white.svg  Logo, white (for dark backgrounds)
  napvera-logo-lockup.svg Logo with "Import & Distribution" tagline
  favicon.svg             Browser tab icon
  map-base.svg            Background map for the hero
  swenap-logo.png         Swenap logo (links to swenap.com)
```

## To update

- **Mumlar logo and link:** in `index.html`, find the comment above the Mumlar tile. Add the logo file to `assets/` and swap the text wordmark for an `<img>`. When the website is ready, change the tile's `<div class="company">` to `<a class="company company-link" href="..." target="_blank" rel="noopener">`.
- **Contact details:** the email (`info@napvera.com`) and address are in the Contact section of `index.html` and in the JSON-LD block in the `<head>`.
- **Colours:** edit the variables in `:root` at the top of `css/style.css`.
