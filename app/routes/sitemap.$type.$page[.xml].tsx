import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getSitemap} from '@shopify/hydrogen';

export async function loader({
  request,
  params,
  context: {storefront},
}: LoaderFunctionArgs) {
  const response = await getSitemap({
    storefront,
    request,
    params,
    locales: ['EN-US'],
    getLink: ({type, baseUrl, handle, locale}) => {
      // Improved URL structure for better SEO
      if (!locale) {
        // Ensure clean URLs without trailing slashes except for root
        if (type === 'index') return baseUrl;
        return `${baseUrl}/${type}/${handle}`;
      }
      return `${baseUrl}/${locale}/${type}/${handle}`;
    },
  });

  // Enhanced caching and SEO headers
  response.headers.set('Cache-Control', `max-age=${60 * 60 * 24}, s-maxage=${60 * 60 * 24 * 7}, public`);
  response.headers.set('Content-Type', 'application/xml; charset=utf-8');
  response.headers.set('X-Robots-Tag', 'noindex'); // Sitemaps shouldn't be indexed themselves

  return response;
}
