# PWA Icons Guide

To make VibeRoom installable as a Progressive Web App (PWA), you need standard app icons.

## Required Sizes
Place the following files in this directory (`public/icons/`):
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-192x192.png` (Standard Android)
- `icon-384x384.png`
- `icon-512x512.png` (Standard Splash)

## Design Recommendation
- Background: Violet (`#7C3AED`)
- Foreground: A simple white 'V' lettermark or coin motif
- Padding: Keep the main logo centered with ~20% padding around the edges.

## Tools
You can easily generate these sizes from a single 512x512 master image using tools like:
1. [Real Favicon Generator](https://realfavicongenerator.net/)
2. [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator)

Don't forget to update the `manifest.json` in the `public` folder to point to these exact file names!
