# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Kavacham**, a premium mobile accessories e-commerce store built with Shopify Hydrogen and React Router 7. The store specializes in device-specific accessories with sophisticated compatibility matching.

## Development Commands

### Essential Commands
```bash
# Start development server with GraphQL codegen
npm run dev

# Build for production with codegen
npm run build

# Preview production build locally
npm run preview

# Type checking
npm run typecheck

# Lint code
npm run lint

# Generate GraphQL types only
npm run codegen
```

### Important Notes
- Always run `npm run dev` (not just `dev`) - includes automatic GraphQL type generation
- Production builds require both build and codegen steps
- Use `npm run typecheck` before committing to catch TypeScript errors

## Architecture Overview

### Framework & Routing
- **Shopify Hydrogen 2025.5.0** with **React Router 7.6.0** (NOT traditional Remix)
- File-based routing in `/app/routes/` using `@react-router/fs-routes`
- Uses **React Router imports** (`react-router`), never `@remix-run/*` packages
- Routes like `[robots.txt].tsx` and `account.$.tsx` use special bracket syntax
- Root layout handles global data loading (header, footer, cart, auth)

### Data Loading Patterns
- **Critical vs Deferred Loading**: Separate above-the-fold from below-the-fold data
- Use `defer()` for non-critical data to improve perceived performance
- Root loader provides global context (cart, customer, shop data)
- Smart revalidation in `shouldRevalidate` function prevents unnecessary refetches

### GraphQL Integration
- All queries use reusable fragments from `/app/lib/fragments.ts`
- Auto-generated TypeScript types - run `npm run codegen` after schema changes
- Storefront context created in `/app/lib/context.ts` with cache configuration
- Use `storefront.CacheLong()` for relatively static data

### Device Compatibility System
This is a **unique business requirement** - products have device compatibility metadata:
- Products contain `supported_devices` metafields (JSON format)
- `DeviceSelector` component handles device/model selection
- `DeviceAwareAddToCartButton` captures device info in cart attributes
- Metafield parsing includes fallback handling for data quality issues

### Component Architecture
- Function components with hooks throughout
- Custom hooks like `useOptimisticVariant` for performance
- Suspense boundaries for progressive loading
- Key components: `DeviceSelector`, `ProductForm`, `DeviceAwareAddToCartButton`

### Authentication & Sessions
- Shopify Customer Account API integration in `/app/routes/account.*`
- Session management via secure cookies with `AppSession.init()`
- OAuth-style auth flow - don't modify auth routes without understanding flow

## Development Guidelines

### Import Rules (Critical)
**Always use React Router 7 imports, never Remix imports:**
```js
// CORRECT
import { useLoaderData, Link, Form } from 'react-router';

// WRONG - Don't use
import { useLoaderData } from '@remix-run/react';
```

### GraphQL Best Practices
- Use existing fragments when possible - check `/app/lib/fragments.ts` first
- Add new fragments for reusable query parts
- Run `npm run codegen` after any GraphQL changes
- Use `defer()` pattern for non-critical data

### Component Development
- Follow existing patterns in `/app/components/`
- Device-related components should handle metafield parsing errors gracefully
- Use TypeScript strictly - all props should be typed
- Consider loading states and error boundaries

### Environment Variables
Required for development:
- `PUBLIC_STOREFRONT_API_TOKEN` - Shopify Storefront API access
- `PUBLIC_STORE_DOMAIN` - Your Shopify store URL
- `SESSION_SECRET` - For secure session cookies
- Customer Account API variables for login functionality

### Common Gotchas
- This uses React Router 7, not traditional Remix - import patterns are different
- Device selector metafields can be malformed JSON - always parse safely
- Cart operations should include device metadata for fulfillment
- CSP is configured with nonces - don't add inline scripts
- Images use Shopify's CDN with automatic optimization

### Testing & Quality
- No testing framework currently configured (see production checklist todos)
- Use `npm run typecheck` and `npm run lint` before commits
- Preview builds locally with `npm run preview` before deployment

### Deployment
- Deploys to Shopify Oxygen (Cloudflare Workers)
- Automatic deployment via GitHub Actions on push
- Environment variables managed through Shopify Partner Dashboard
- Build includes both application build and GraphQL codegen

## Key Files to Understand
- `/app/lib/context.ts` - Storefront client and cache configuration
- `/app/lib/fragments.ts` - Reusable GraphQL fragments
- `/app/root.tsx` - Global layout and data loading
- `/app/components/DeviceSelector/` - Core business logic for device compatibility
- `/app/routes.ts` - Route configuration
- `vite.config.ts` - Build configuration with Hydrogen plugin

## Business Logic Notes
- Device compatibility is central to the user experience
- Products may have multiple variants per device/model combination
- Cart attributes capture device selection for order fulfillment
- Rich content managed via Shopify metaobjects (hero banners, etc.)
- SEO-friendly URLs with automatic canonical handling

## Production Readiness Checklist

The following items need to be addressed before production launch:

### High Priority (Critical for Launch)
- [ ] Set up external monitoring service (Sentry, DataDog, or similar)
- [ ] Implement structured logging with log levels and log drains
- [ ] Add security headers (HSTS, X-Frame-Options, X-Content-Type-Options)
- [ ] Implement Google Analytics 4 with enhanced e-commerce tracking
- [ ] Add Meta Pixel with Conversions API
- [ ] Set up comprehensive testing suite (unit tests with Vitest)
- [ ] Add E2E tests with Playwright
- [ ] Add quality gates to CI/CD pipeline
- [ ] Set up staging environment
- [ ] Add automated rollback mechanisms
- [ ] Set up deployment monitoring and alerts
- [ ] Coordinate load testing with Shopify Support (3-5 weeks advance)

### Medium Priority (Important for Operations)
- [ ] Implement rate limiting middleware
- [ ] Add input validation and sanitization
- [ ] Create product feeds for Google Shopping and Facebook
- [ ] Implement UTM parameter tracking and campaign attribution
- [ ] Add conversion tracking for Google Ads and Facebook Ads
- [ ] Implement component testing with React Testing Library
- [ ] Implement preview deployments for feature branches
- [ ] Configure order status page redirects
- [ ] Implement Shopify Scripts management
- [ ] Add dependency vulnerability scanning
- [ ] Implement secrets scanning in CI/CD
- [ ] Add performance monitoring (Core Web Vitals)
- [ ] Create incident response process documentation
- [ ] Document production rollout plan

### Low Priority (Nice to Have)
- [ ] Configure CORS if needed for cross-origin requests
- [ ] Set up Lighthouse CI integration

### Notes
- Always run `npm run lint` and `npm run typecheck` before commits
- Shopify production checklist requires 3-5 weeks advance notice for load testing coordination
- Testing framework needs to be set up from scratch - no existing test infrastructure