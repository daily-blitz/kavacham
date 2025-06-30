import {Suspense} from 'react';
import {Await, NavLink, Link} from 'react-router';
import {motion} from 'framer-motion';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="bg-black">
            <div className="container-custom pt-20 pb-8">
              {/* Main Footer Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
                {/* Left Column - Brand */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center justify-center space-y-8 h-full"
                >
                  {/* Logo */}
                  <div className="flex flex-col items-center space-y-4">
                    <img 
                      src="/assets/kavacham-logo.svg" 
                      alt="Kavacham Logo" 
                      className="h-16 w-auto"
                    />
                    <span className="text-3xl font-bold text-white tracking-wide">KAVACHAM</span>
                  </div>
                  
                  {/* Social Links */}
                  <div className="flex gap-4">
                    <SocialLink 
                      href="https://instagram.com" 
                      icon="instagram" 
                      label="Instagram"
                    />
                    <SocialLink 
                      href="https://twitter.com" 
                      icon="twitter" 
                      label="Twitter"
                    />
                    <SocialLink 
                      href="https://facebook.com" 
                      icon="facebook" 
                      label="Facebook"
                    />
                    <SocialLink 
                      href="https://youtube.com" 
                      icon="youtube" 
                      label="YouTube"
                    />
                  </div>
                </motion.div>
                
                {/* Right Column - Navigation */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
                  {/* Shop */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="space-y-4"
                  >
                    <h3 className="text-white font-semibold text-lg">Shop</h3>
                    <ul className="space-y-3">
                      {footer?.collections?.nodes && footer.collections.nodes.length > 0 ? (
                        <>
                          {[...footer.collections.nodes]
                            .sort((a, b) => {
                              // Sort by product count (descending)
                              const aCount = a.productsCount?.nodes?.length || 0;
                              const bCount = b.productsCount?.nodes?.length || 0;
                              return bCount - aCount;
                            })
                            .map((collection) => {
                              const isEmpty = collection.productsCount?.nodes?.length === 0;
                              
                              if (isEmpty) {
                                return (
                                  <li key={collection.id}>
                                    <span className="!text-gray-500 text-base font-medium inline-flex items-center cursor-not-allowed">
                                      {collection.title}
                                      <span className="ml-2 text-xs text-gray-400 font-normal">(Coming Soon)</span>
                                    </span>
                                  </li>
                                );
                              }
                              
                              return (
                                <FooterLink 
                                  key={collection.id} 
                                  to={`/collections/${collection.handle}`}
                                >
                                  {collection.title}
                                </FooterLink>
                              );
                            })}
                          <FooterLink to="/collections/all">All Products</FooterLink>
                        </>
                      ) : (
                        // Fallback if no collections are loaded
                        <>
                          <FooterLink to="/collections/all">All Products</FooterLink>
                        </>
                      )}
                    </ul>
                  </motion.div>
                  
                  {/* Support */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="space-y-4"
                  >
                    <h3 className="text-white font-semibold text-lg">Support</h3>
                    <ul className="space-y-3">
                      <FooterLink to="/contact">Contact Us</FooterLink>
                      <FooterLink to="/faq">FAQ</FooterLink>
                      <FooterLink to="/how-to-apply">Installation Guide</FooterLink>
                      <FooterLink to="/shipping">Shipping Info</FooterLink>
                      <FooterLink to="/returns">Returns & Warranty</FooterLink>
                    </ul>
                  </motion.div>
                  
                  {/* Company */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="space-y-4"
                  >
                    <h3 className="text-white font-semibold text-lg">Company</h3>
                    <ul className="space-y-3">
                      <FooterLink to="/about">About Us</FooterLink>
                      <FooterLink to="/blogs/news">Blog</FooterLink>
                      <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
                      <FooterLink to="/terms-of-service">Terms of Service</FooterLink>
                      {footer?.menu && header.shop.primaryDomain?.url && (
                        <FooterMenu
                          menu={footer.menu}
                          primaryDomainUrl={header.shop.primaryDomain.url}
                          publicStoreDomain={publicStoreDomain}
                        />
                      )}
                    </ul>
                  </motion.div>
                </div>
              </div>
              
              {/* Bottom Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="mt-16 pt-8 border-t border-gray-600"
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <p className="text-white text-sm">
                    © {new Date().getFullYear()} Kavacham. All rights reserved.
                  </p>
                  <div className="flex items-center gap-8 text-sm">
                    <Link to="/privacy-policy" className="text-white hover:text-gray-300 transition-colors">
                      Privacy Policy
                    </Link>
                    <Link to="/terms-of-service" className="text-white hover:text-gray-300 transition-colors">
                      Terms of Service
                    </Link>
                    <span className="text-white">Made with ❤️ in India</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

// Social Link Component
function SocialLink({ 
  href, 
  icon, 
  label 
}: { 
  href: string; 
  icon: string; 
  label: string; 
}) {
  const getIcon = () => {
    switch (icon) {
      case 'instagram':
        return (
          <svg className="w-6 h-6" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        );
      case 'twitter':
        return (
          <svg className="w-6 h-6" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
          </svg>
        );
      case 'facebook':
        return (
          <svg className="w-6 h-6" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
          </svg>
        );
      case 'youtube':
        return (
          <svg className="w-6 h-6" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
            <polygon points="9.75,15.02 15.5,11.75 9.75,8.48"></polygon>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 hover:opacity-70 transition-all duration-200"
      aria-label={label}
      style={{ color: 'white' }}
    >
      {getIcon()}
    </a>
  );
}

// Footer Link Component
function FooterLink({ 
  to, 
  children 
}: { 
  to: string; 
  children: React.ReactNode; 
}) {
  return (
    <li>
      <Link
        to={to}
        className="!text-white hover:!text-gray-300 transition-colors duration-200 text-base font-medium inline-flex items-center"
      >
        {children}
      </Link>
    </li>
  );
}

// Footer Menu Component
function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <>
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return (
          <li key={item.id}>
            {isExternal ? (
              <a 
                href={url} 
                rel="noopener noreferrer" 
                target="_blank"
                className="!text-white hover:!text-gray-300 transition-colors duration-200 text-base font-medium"
              >
                {item.title}
              </a>
            ) : (
              <NavLink
                end
                prefetch="intent"
                style={activeLinkStyle}
                to={url}
                className="!text-white hover:!text-gray-300 transition-colors duration-200 text-base font-medium"
              >
                {item.title}
              </NavLink>
            )}
          </li>
        );
      })}
    </>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? '600' : '500',
    color: 'white !important',
  };
}