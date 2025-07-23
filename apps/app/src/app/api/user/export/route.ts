import { NextResponse } from 'next/server';
import { auth } from '@repo/auth/server';
import { db } from '@repo/database';
import JSZip from 'jszip';

export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile
    const profile = await db.profile.findUnique({
      where: { clerkId: userId },
      include: {
        scrapes: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create ZIP file
    const zip = new JSZip();
    const exportDate = new Date().toISOString();

    // Add user profile data
    const profileData = {
      id: profile.id,
      username: profile.username,
      firstName: profile.firstName,
      createdAt: profile.createdAt,
      exportDate,
    };
    zip.file('profile.json', JSON.stringify(profileData, null, 2));

    // Add scrapes data
    const scrapesFolder = zip.folder('scrapes');
    
    if (scrapesFolder && profile.scrapes.length > 0) {
      // Create index of all scrapes
      const scrapeIndex = profile.scrapes.map(scrape => ({
        id: scrape.id,
        url: scrape.url,
        createdAt: scrape.createdAt,
        status: scrape.status,
      }));
      scrapesFolder.file('index.json', JSON.stringify(scrapeIndex, null, 2));

      // Add individual scrape data
      for (const scrape of profile.scrapes) {
        const scrapeFolder = scrapesFolder.folder(scrape.id);
        if (scrapeFolder) {
          // Metadata
          scrapeFolder.file('metadata.json', JSON.stringify({
            id: scrape.id,
            url: scrape.url,
            status: scrape.status,
            createdAt: scrape.createdAt,
            formats: scrape.formats,
            error: scrape.error,
          }, null, 2));

          // Results
          if (scrape.markdown) {
            scrapeFolder.file('content.md', scrape.markdown);
          }
          if (scrape.html) {
            scrapeFolder.file('content.html', scrape.html);
          }
          if (scrape.rawHtml) {
            scrapeFolder.file('raw.html', scrape.rawHtml);
          }
          if (scrape.metadata) {
            scrapeFolder.file('page-metadata.json', JSON.stringify(scrape.metadata, null, 2));
          }
          if (scrape.links) {
            scrapeFolder.file('links.json', JSON.stringify(scrape.links, null, 2));
          }
        }
      }
    }

    // Add README
    const readme = `# Firescrape Data Export

Export Date: ${exportDate}
User ID: ${profile.id}
Total Scrapes: ${profile.scrapes.length}

## Contents

- profile.json - Your profile information
- scrapes/ - All your scrape history
  - index.json - List of all scrapes
  - [scrape-id]/ - Individual scrape data

## Privacy

This export contains all data associated with your Firescrape account.
For privacy concerns, please contact support.
`;
    zip.file('README.md', readme);

    // Generate ZIP
    const zipBlob = await zip.generateAsync({ type: 'nodebuffer' });

    // Return ZIP file
    return new NextResponse(zipBlob, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="firescrape-export-${exportDate.split('T')[0]}.zip"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}