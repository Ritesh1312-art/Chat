import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'VibeRoom',
    short_name: 'VibeRoom',
    description: 'Real-time video chat, DMs & live translation',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#080810',
    theme_color: '#7C3AED',
    categories: ['social', 'communication'],
    icons: [
      { src: '/icons/icon-72.png', sizes: '72x72', type: 'image/png' },
      { src: '/icons/icon-96.png', sizes: '96x96', type: 'image/png' },
      { src: '/icons/icon-128.png', sizes: '128x128', type: 'image/png' },
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ],
    screenshots: [],
    shortcuts: [
      { name: 'Zone A — Meet Strangers', url: '/zone-a', icons: [{ src: '/icons/icon-96.png', sizes: '96x96' }] },
      { name: 'Zone B — My Chats', url: '/zone-b', icons: [{ src: '/icons/icon-96.png', sizes: '96x96' }] }
    ]
  }
}
