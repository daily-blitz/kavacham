import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {parseGid} from '@shopify/hydrogen';

export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const {shop} = await context.storefront.query(ROBOTS_QUERY);

  const shopId = parseGid(shop.id).id;
  const body = robotsTxtData({url: url.origin, shopId});

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',

      'Cache-Control': `max-age=${60 * 60 * 24}`,
    },
  });
}

function robotsTxtData({url, shopId}: {shopId?: string; url?: string}) {
  const sitemapUrl = url ? `${url}/sitemap.xml` : undefined;

  return `
User-agent: *
${generalDisallowRules({sitemapUrl, shopId})}

# Google adsbot ignores robots.txt unless specifically named!
User-agent: adsbot-google
Disallow: /checkouts/
Disallow: /checkout
Disallow: /carts
Disallow: /orders
${shopId ? `Disallow: /${shopId}/checkouts` : ''}
${shopId ? `Disallow: /${shopId}/orders` : ''}
Disallow: /*?*oseid=*
Disallow: /*preview_theme_id*
Disallow: /*preview_script_id*

# E-commerce focused crawlers
User-agent: Googlebot
Allow: /products/
Allow: /collections/
Allow: /blogs/
Allow: /pages/
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /products/
Allow: /collections/
Allow: /blogs/
Allow: /pages/
Allow: /
Crawl-delay: 1

# Social media crawlers
User-agent: facebookexternalhit
Allow: /products/
Allow: /collections/
Allow: /

User-agent: Twitterbot
Allow: /products/
Allow: /collections/
Allow: /

User-agent: LinkedInBot
Allow: /products/
Allow: /collections/
Allow: /

# SEO tools with controlled access
User-agent: AhrefsBot
Crawl-delay: 10
${generalDisallowRules({sitemapUrl, shopId})}

User-agent: AhrefsSiteAudit
Crawl-delay: 10
${generalDisallowRules({sitemapUrl, shopId})}

User-agent: SemrushBot
Crawl-delay: 10
${generalDisallowRules({sitemapUrl, shopId})}

User-agent: MJ12bot
Crawl-delay: 10
${generalDisallowRules({sitemapUrl, shopId})}

User-agent: DotBot
Crawl-delay: 10

# Aggressive crawlers to block
User-agent: Nutch
Disallow: /

User-agent: MegaIndex
Disallow: /

User-agent: SeznamBot
Disallow: /

User-agent: BLEXBot
Disallow: /

# Social media with controlled access
User-agent: Pinterest
Crawl-delay: 1
Allow: /products/
Allow: /collections/

User-agent: WhatsApp
Allow: /products/
Allow: /collections/
Allow: /

# Allow specific product images and media
User-agent: *
Allow: /cdn/
Allow: /*.jpg
Allow: /*.jpeg
Allow: /*.png
Allow: /*.gif
Allow: /*.webp
Allow: /*.svg
Allow: /*.css
Allow: /*.js
`.trim();
}

/**
 * This function generates disallow rules that generally follow what Shopify's
 * Online Store has as defaults for their robots.txt
 */
function generalDisallowRules({
  shopId,
  sitemapUrl,
}: {
  shopId?: string;
  sitemapUrl?: string;
}) {
  return `Disallow: /admin
Disallow: /cart
Disallow: /orders
Disallow: /checkouts/
Disallow: /checkout
${shopId ? `Disallow: /${shopId}/checkouts` : ''}
${shopId ? `Disallow: /${shopId}/orders` : ''}
Disallow: /carts
Disallow: /collections/*sort_by*
Disallow: /*/collections/*sort_by*
Disallow: /collections/*+*
Disallow: /collections/*%2B*
Disallow: /collections/*%2b*
Disallow: /*/collections/*+*
Disallow: /*/collections/*%2B*
Disallow: /*/collections/*%2b*
Disallow: */collections/*filter*&*filter*
Disallow: /blogs/*+*
Disallow: /blogs/*%2B*
Disallow: /blogs/*%2b*
Disallow: /*/blogs/*+*
Disallow: /*/blogs/*%2B*
Disallow: /*/blogs/*%2b*
Disallow: /*?*oseid=*
Disallow: /*preview_theme_id*
Disallow: /*preview_script_id*
Disallow: /policies/
Disallow: /*/*?*ls=*&ls=*
Disallow: /*/*?*ls%3D*%3Fls%3D*
Disallow: /*/*?*ls%3d*%3fls%3d*
Disallow: /search/?*
Disallow: /apple-app-site-association
Disallow: /.well-known/shopify/monorail
Disallow: /discount/
Allow: /search
Allow: /policies/privacy-policy
Allow: /policies/terms-of-service
Allow: /policies/shipping
Allow: /policies/returns
${sitemapUrl ? `Sitemap: ${sitemapUrl}` : ''}`;
}

const ROBOTS_QUERY = `#graphql
  query StoreRobots($country: CountryCode, $language: LanguageCode)
   @inContext(country: $country, language: $language) {
    shop {
      id
    }
  }
` as const;
