import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Old WordPress permalinks all ended in a trailing slash
  // (e.g. /listing/caffe-mocha/). Matching that exactly avoids
  // an extra redirect hop for every indexed URL.
  trailingSlash: true,

  images: {
    remotePatterns: [
      { protocol: "http", hostname: "mymadhepura.com" },
      { protocol: "https", hostname: "mymadhepura.com" },
      // Original WordPress media library. The apex domain now points at
      // Vercel, so listing photos are served from this subdomain, which
      // is pointed directly at the old Hostinger WordPress install.
      { protocol: "https", hostname: "oldmedia.mymadhepura.com" },
      { protocol: "http", hostname: "oldmedia.mymadhepura.com" },
    ],
  },

  async redirects() {
    return [
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/faqs-frequently-asked-questions", destination: "/faqs", permanent: true },
      { source: "/privacy-policy-2", destination: "/privacy-policy", permanent: true },
      { source: "/copyright-policy", destination: "/terms-of-service", permanent: true },
      { source: "/content-policy", destination: "/terms-of-service", permanent: true },
      { source: "/disclaimer", destination: "/terms-of-service", permanent: true },
      { source: "/shop", destination: "/", permanent: true },
      { source: "/shop/:path*", destination: "/", permanent: true },
      { source: "/cart", destination: "/", permanent: true },
      { source: "/checkout", destination: "/", permanent: true },
      { source: "/my-account", destination: "/", permanent: true },
      { source: "/my-account/:path*", destination: "/", permanent: true },
      { source: "/sample-page", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
