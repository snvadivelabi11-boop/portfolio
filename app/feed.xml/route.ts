import { siteConfig } from '@/utils/seo';

export async function GET() {
  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${siteConfig.title}</title>
    <link>${siteConfig.url}</link>
    <description>${siteConfig.description}</description>
    <language>${siteConfig.language}</language>
    <managingEditor>${siteConfig.author.email} (${siteConfig.author.name})</managingEditor>
    <webMaster>${siteConfig.author.email} (${siteConfig.author.name})</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml" />
    <item>
      <title>Portfolio Launch — Abishek</title>
      <link>${siteConfig.url}</link>
      <description>Explore the portfolio of Abishek — Full Stack Developer and AI Automation Engineer. Discover projects, skills, and services in web development and AI.</description>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <guid isPermaLink="true">${siteConfig.url}</guid>
      <dc:creator>${siteConfig.author.name}</dc:creator>
    </item>
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}
