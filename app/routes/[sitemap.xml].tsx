import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getSitemapIndex} from '@shopify/hydrogen';

export async function loader({
  request,
  context: {storefront},
}: LoaderFunctionArgs) {
  const response = await getSitemapIndex({
    storefront,
    request,
  });

  // Enhanced caching and SEO headers for sitemap index
  response.headers.set('Cache-Control', `max-age=${60 * 60 * 24}, s-maxage=${60 * 60 * 24 * 7}, public`);
  response.headers.set('Content-Type', 'application/xml; charset=utf-8');
  response.headers.set('X-Robots-Tag', 'noindex'); // Sitemap index shouldn't be indexed
  response.headers.set('Last-Modified', new Date().toUTCString());

  return response;
}
