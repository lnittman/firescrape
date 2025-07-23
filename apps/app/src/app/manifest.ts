import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Firescrape - Web Scraping Playground',
    short_name: 'Firescrape',
    description: 'Turn any URL into clean data. A delightful playground for Firecrawl\'s powerful web scraping API.',
    start_url: '/',
    scope: '/',
    display: 'minimal-ui',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#0a0a0a',
    categories: ['productivity', 'utilities', 'developer'],
    icons: [
      {
        src: '/icon',
        sizes: '64x64',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcuts: [
      {
        name: 'New Scrape',
        short_name: 'Scrape',
        description: 'Start a new web scrape',
        url: '/?action=new',
      },
      {
        name: 'My Runs',
        short_name: 'History',
        description: 'View your scraping history',
        url: '/my-runs',
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  }
}
