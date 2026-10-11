# App icon

`icon.png` (512x512 PNG) is cropped from the game's own poster art,
`public/poster-starways.jpeg`: a square extract (left 302, top 86,
346x346) centered on the white spacesuit helmet with the cracked visor,
on the dark space background with the teal crescent planet hinted in the
top-right corner. Palette-quantized to keep it under the 256 KB icon
limit (~122 KB).

It is wired as:

- the Homeroom home-screen tile via the `icon` block in `dapp.json`
  (reads `brand/icon.png` at deploy time; the app never serves it)
- the PWA icon via `public/manifest.webmanifest` (`/icon-192.png`,
  `/icon-512.png`) and `apple-touch-icon` (`/icon-180.png`) in the three
  pages (`hub.html`, `index.html`, `dracula.html`), so installing the
  app on a phone home screen shows the same art.

To redraw it: re-crop from the poster JPEG (a `sharp` one-liner) rather
than editing the PNG by hand.
