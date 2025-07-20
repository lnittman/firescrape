import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Yuba - AI Outdoor Companion',
    short_name: 'Yuba',
    description: 'Your AI-native outdoor companion. Discover activities, check conditions, get personalized recommendations, and stay safe on all your outdoor adventures.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#0a0a0a',
    categories: ['productivity', 'utilities', 'business'],
    shortcuts: [
      {
        name: 'Discover Activities',
        short_name: 'Discover',
        description: 'Find your next outdoor adventure',
        url: '/?action=new',
        icons: [{ src: '/logo/1.png', sizes: '96x96' }],
      },
      {
        name: 'Recent Activities',
        short_name: 'Recent',
        description: 'View your recent outdoor activities',
        url: '/?view=recent',
        icons: [{ src: '/logo/2.png', sizes: '96x96' }],
      },
    ],
    icons: [
      {
        src: '/logo/1.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/logo/1.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/logo/1.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/logo/5.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
      },
      {
        src: '/logo/5.png',
        sizes: '720x1280',
        type: 'image/png',
        form_factor: 'narrow',
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  }
}
