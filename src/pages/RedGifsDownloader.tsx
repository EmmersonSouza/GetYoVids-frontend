import React from "react";
import { Helmet } from "react-helmet-async";
import { ToolPage } from "../components/ToolPage";
import { InternalLinking } from "../components/InternalLinking";
import { sidebarConfig } from "../config/sidebarConfig";

const RedGifsDownloader = () => {
  const config = sidebarConfig[1].items.find(item => item.path === "/redgifs-downloader")!;
  
  return (
    <>
      <Helmet>
        <title>Download RedGifs Videos - Free GIF and Video Downloader | GetYoVids.com</title>
        <meta name="description" content="Download RedGifs content in high quality. Save GIFs and videos from RedGifs for free. Fast, secure, and easy-to-use RedGifs downloader." />
        <meta name="keywords" content="redgifs downloader, download redgifs videos, redgifs gif downloader, save redgifs content, redgifs to mp4, redgifs video saver, free redgifs downloader" />
        <link rel="canonical" href="https://getyovids.com/redgifs-downloader" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://getyovids.com/redgifs-downloader" />
        <meta property="og:title" content="Download RedGifs Videos - Free GIF and Video Downloader" />
        <meta property="og:description" content="Download RedGifs content in high quality. Save GIFs and videos from RedGifs for free. Fast, secure, and easy-to-use RedGifs downloader." />
        <meta property="og:image" content="https://getyovids.com/og-image.png" />
        <meta property="og:site_name" content="GetYoVids.com" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://getyovids.com/redgifs-downloader" />
        <meta property="twitter:title" content="Download RedGifs Videos - Free GIF and Video Downloader" />
        <meta property="twitter:description" content="Download RedGifs content in high quality. Save GIFs and videos from RedGifs for free." />
        <meta property="twitter:image" content="https://getyovids.com/og-image.png" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="GetYoVids.com" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Structured Data for RedGifs Downloader */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "RedGifs Downloader",
            "description": "Download RedGifs content in high quality. Save GIFs and videos from RedGifs for free.",
            "url": "https://getyovids.com/redgifs-downloader",
            "applicationCategory": "MultimediaApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "provider": {
              "@type": "Organization",
              "name": "GetYoVids.com",
              "url": "https://getyovids.com"
            },
            "featureList": [
              "Download RedGifs videos",
              "Download RedGifs GIFs", 
              "High quality downloads",
              "Free to use",
              "No registration required",
              "Fast download speeds"
            ]
          })}
        </script>
      </Helmet>
      
      <ToolPage 
        title={config.title}
        description={config.description}
        placeholder="Paste RedGifs URL here (e.g., https://www.redgifs.com/watch/...)"
        buttonText="Download"
        showFormatOptions={true}
      />

      {/* SEO Content Section */}
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="mt-12 bg-card rounded-lg border border-gray-800 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            How to Download RedGifs Videos
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Step 1: Copy RedGifs URL</h3>
              <p>Navigate to the RedGifs video you want to download and copy the URL from your browser's address bar. The URL should look like: https://www.redgifs.com/watch/...</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Step 2: Paste and Download</h3>
              <p>Paste the RedGifs URL into our downloader above and click the download button to start the process. Our system will automatically detect the content type.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Step 3: Choose Format</h3>
              <p>Select your preferred format (MP4, GIF, etc.) and quality before downloading your content. We support multiple formats for maximum compatibility.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Step 4: Download Complete</h3>
              <p>Your RedGifs video will be processed and ready for download in just a few seconds. All files are securely stored for fast access.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 bg-card rounded-lg border border-gray-800 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Is RedGifs downloader free?</h3>
              <p className="text-gray-300">Yes, our RedGifs downloader is completely free to use. No registration or payment required. You can download unlimited content without any restrictions.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">What formats can I download?</h3>
              <p className="text-gray-300">You can download RedGifs content in MP4, GIF, and other popular video formats. We support high-quality downloads with multiple resolution options.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Is it safe to use?</h3>
              <p className="text-gray-300">Absolutely! Our RedGifs downloader is secure and doesn't store your personal information. All downloads are processed securely and files are automatically cleaned up.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Can I download private RedGifs content?</h3>
              <p className="text-gray-300">Our downloader works with publicly accessible RedGifs content. For private content, you would need to ensure you have proper access permissions.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">How fast is the download process?</h3>
              <p className="text-gray-300">Downloads are typically processed within 10-30 seconds depending on the file size and server load. Our optimized system ensures fast and reliable downloads.</p>
            </div>
          </div>
        </div>

        {/* Internal Linking */}
        <InternalLinking currentPage="/redgifs-downloader" category="adult-downloaders" />
      </div>
    </>
  );
};

export default RedGifsDownloader;
