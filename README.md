# Kavacham - Premium Mobile Accessories Store

<div align="center">
  <img src="./app/assets/Kavacham logo.svg" alt="Kavacham Logo" width="120" height="120">
  
  **Premium mobile accessories crafted for the discerning tech enthusiast**
  
  [![Shopify](https://img.shields.io/badge/Shopify-Hydrogen-green.svg)](https://shopify.dev/docs/custom-storefronts/hydrogen)
  [![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)](https://tailwindcss.com/)
</div>

## 🛡️ About Kavacham

Kavacham is a premium e-commerce platform specializing in high-quality mobile accessories. Built with Shopify Hydrogen and modern web technologies, we offer:

- **Self-healing phone skins** with advanced scratch protection
- **Premium phone cases** with lifetime warranty
- **Screen protectors** with bubble-free installation
- **Custom accessories** for major smartphone brands

## ✨ Features

### 🎨 **Modern Design**
- Sleek, minimal interface with gradient backgrounds
- Responsive design optimized for all devices
- Smooth animations and micro-interactions
- Professional dark theme with high contrast

### 🛍️ **Enhanced Shopping Experience**
- **Smart Device Selector** - Choose your exact device model with visual confirmation
- **Interactive Product Gallery** - Multiple product images with zoom functionality
- **Intelligent Filtering** - Sort by price, popularity, and features
- **Grid/List View Toggle** - Customize your browsing experience

### 🔧 **Advanced Features**
- **Product Recommendations** - AI-powered suggestions based on browsing
- **Infinite Scroll** - Seamless product loading
- **Real-time Search** - Instant results as you type
- **Brand Logos** - Visual brand recognition in device selection

### 📱 **Mobile Optimized**
- Touch-friendly interface
- Optimized loading for mobile networks
- Progressive Web App capabilities
- Mobile-first responsive design

## 🏗️ Tech Stack

### **Frontend Framework**
- **[Shopify Hydrogen](https://shopify.dev/docs/custom-storefronts/hydrogen)** - React-based framework for headless commerce
- **[Remix](https://remix.run/)** - Full-stack web framework
- **[React 18](https://reactjs.org/)** - Modern React with concurrent features

### **Styling & UI**
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready motion library
- **[Headless UI](https://headlessui.com/)** - Unstyled, accessible UI components

### **Development Tools**
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Vite](https://vitejs.dev/)** - Fast build tool and dev server
- **[ESLint](https://eslint.org/)** - Code linting and formatting
- **[Prettier](https://prettier.io/)** - Code formatting

### **Backend & Data**
- **[Shopify Storefront API](https://shopify.dev/docs/api/storefront)** - GraphQL API for commerce
- **[GraphQL Code Generator](https://www.graphql-code-generator.com/)** - Type-safe GraphQL queries

## 🚀 Getting Started

### **Prerequisites**
- Node.js version 18.0.0 or higher
- npm or yarn package manager
- Shopify Partner account (for development)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/akshay-shah/kavacham.git
   cd kavacham/hydrogen-storefront
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Add your Shopify store credentials:
   ```env
   PUBLIC_STOREFRONT_API_TOKEN=your_storefront_access_token
   PUBLIC_STORE_DOMAIN=your-store.myshopify.com
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🛠️ Development

### **Available Scripts**

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run typecheck

# Lint code
npm run lint

# Format code
npm run format

# Generate GraphQL types
npm run codegen
```

### **Project Structure**

```
app/
├── components/          # Reusable UI components
│   ├── DeviceSelector/  # Smart device selection
│   ├── ProductGallery/  # Product image gallery
│   ├── Header/          # Navigation header
│   └── Footer/          # Site footer
├── routes/              # Remix routes
│   ├── _index.tsx       # Homepage
│   ├── products/        # Product pages
│   └── collections/     # Category pages
├── styles/              # Global styles
├── lib/                 # Utility functions
└── assets/              # Static assets
```

## 🎯 Key Components

### **Device Selector**
Smart component that helps customers select their exact device model:
- Brand logos for visual recognition
- Search functionality for large device lists
- Model images for accurate selection
- Real-time compatibility checking

### **Product Gallery**
Enhanced image viewing experience:
- Multiple product images with thumbnails
- Click-to-zoom modal functionality
- Smooth transitions between images
- Mobile-optimized touch interactions

### **Enhanced Product Cards**
Modern product display with:
- Hover animations and effects
- Quick view functionality
- Add to cart from listing pages
- Wishlist integration

## 🌐 Deployment

### **Production Build**

```bash
# Create production build
npm run build

# Preview locally
npm run preview
```

### **Deploy to Shopify Oxygen**

```bash
# Deploy to Oxygen
npm run deploy
```

### **Environment Variables**

Required environment variables for production:

```env
PUBLIC_STOREFRONT_API_TOKEN=
PUBLIC_STORE_DOMAIN=
PUBLIC_CHECKOUT_DOMAIN=
PRIVATE_STOREFRONT_API_TOKEN=
```

## 🔧 Configuration

### **Shopify Settings**
- Configure Storefront API access
- Set up custom metafields for device compatibility
- Configure payment and shipping settings

### **Performance Optimization**
- Image optimization with Shopify's CDN
- Lazy loading for product images
- Code splitting for faster loading
- Service worker for offline functionality

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Test accessibility
npm run test:a11y
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 8+)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Shopify Hydrogen Docs](https://shopify.dev/docs/custom-storefronts/hydrogen)
- **Community**: [Shopify Community](https://community.shopify.com/)
- **Issues**: [GitHub Issues](https://github.com/akshay-shah/kavacham/issues)

## 🏆 Acknowledgments

- **Shopify** for the amazing Hydrogen framework
- **Remix** team for the excellent full-stack framework
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for smooth animations

---

<div align="center">
  <p><strong>Built with ❤️ for mobile enthusiasts</strong></p>
  <p>© 2024 Kavacham. All rights reserved.</p>
</div>