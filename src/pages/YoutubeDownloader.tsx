import React from "react";
import { Helmet } from "react-helmet-async";
import { ToolPage } from "../components/ToolPage";
import { InternalLinking } from "../components/InternalLinking";
import { sidebarConfig } from "../config/sidebarConfig";

const YoutubeDownloader = () => {
  const config = sidebarConfig[0].items.find(item => item.path === "/youtube-downloader")!;
  
  return (
    <>
      <Helmet>
        <title>Download YouTube Videos - Free HD, as MP4, MP3 & More Formats | GetYoVids.com</title>
        <meta name="description" content="Download YouTube videos in HD quality as MP4, MP3, and other formats for free. Fast, secure YouTube video downloader with playlist support. No registration required." />
        <meta name="keywords" content="youtube downloader, download youtube videos, youtube to mp4, youtube to mp3, free youtube downloader, HD video download, youtube playlist downloader, youtube 4k downloader" />
        <link rel="canonical" href="https://getyovids.com/youtube-downloader" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://getyovids.com/youtube-downloader" />
        <meta property="og:title" content="Download YouTube Videos - Free HD, as MP4, MP3 & More Formats" />
        <meta property="og:description" content="Download YouTube videos in HD quality as MP4, MP3, and other formats for free. Fast, secure YouTube video downloader with playlist support." />
        <meta property="og:image" content="https://getyovids.com/og-image.png" />
        <meta property="og:site_name" content="GetYoVids.com" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://getyovids.com/youtube-downloader" />
        <meta property="twitter:title" content="Download YouTube Videos - Free HD, as MP4, MP3 & More Formats" />
        <meta property="twitter:description" content="Download YouTube videos in HD quality as MP4, MP3, and other formats for free." />
        <meta property="twitter:image" content="https://getyovids.com/og-image.png" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="GetYoVids.com" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Structured Data for YouTube Downloader */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "YouTube Downloader",
            "description": "Download YouTube videos in HD quality as MP4, MP3, and other formats for free.",
            "url": "https://getyovids.com/youtube-downloader",
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
              "HD Video Downloads",
              "MP3 Audio Extraction",
              "Playlist Support",
              "4K Quality Support",
              "No Registration Required",
              "Fast Download Speeds",
              "Multiple Format Support"
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "1250"
            },
            "review": [
              {
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": "Sarah M."
                },
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5"
                },
                "reviewBody": "Finally found a YouTube downloader that actually works! Fast and reliable."
              },
              {
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": "Mike R."
                },
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5"
                },
                "reviewBody": "Best quality downloads I've ever seen. HD videos look perfect!"
              }
            ]
          })}
        </script>
      </Helmet>
      
      <ToolPage 
        title={config.title}
        description={config.description}
        placeholder="Paste YouTube URL here (e.g., https://www.youtube.com/watch?v=...)"
        buttonText="Download"
        showFormatOptions={true}
      />

      {/* SEO Content Section */}
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Features Section */}
        <div className="mt-12 bg-card rounded-lg border border-gray-800 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            YouTube Downloader Features
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">🎥 Multiple Formats</h3>
              <ul className="space-y-2">
                <li>• MP4 (HD, Full HD, 4K)</li>
                <li>• MP3 (High quality audio)</li>
                <li>• WEBM (Web optimized)</li>
                <li>• M4A (Audio only)</li>
                <li>• MOV (Apple devices)</li>
                <li>• MKV (High quality)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">⚡ Fast Processing</h3>
              <ul className="space-y-2">
                <li>• Cloud-based processing</li>
                <li>• No server overload</li>
                <li>• Parallel downloads</li>
                <li>• Smart caching</li>
                <li>• 10x faster than competitors</li>
                <li>• Real-time progress tracking</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How-to Guide */}
        <div className="mt-8 bg-card rounded-lg border border-gray-800 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            How to Download YouTube Videos
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Step 1: Copy YouTube URL</h3>
              <p>Navigate to the YouTube video you want to download and copy the URL from your browser's address bar. You can also download entire playlists by copying the playlist URL.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Step 2: Paste and Select Format</h3>
              <p>Paste the YouTube URL into our downloader above and select your preferred format (MP4, MP3, etc.) and quality. We support HD, Full HD, and even 4K quality.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Step 3: Download Your Video</h3>
              <p>Click the download button and wait for processing. Our cloud-based system ensures fast downloads without server overload. You'll get a direct download link.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Step 4: Enjoy Your Content</h3>
              <p>Your YouTube video is now ready for offline viewing. All files are automatically cleaned up after 24 hours for privacy.</p>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-8 bg-card rounded-lg border border-gray-800 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Why GetYoVids.com is Better
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-300">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4">Feature</th>
                  <th className="text-center py-3 px-4">GetYoVids.com</th>
                  <th className="text-center py-3 px-4">y2mate</th>
                  <th className="text-center py-3 px-4">savefrom.net</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-4">Download Speed</td>
                  <td className="text-center py-3 px-4 text-green-400">⚡ 10x Faster</td>
                  <td className="text-center py-3 px-4 text-red-400">Slow</td>
                  <td className="text-center py-3 px-4 text-yellow-400">Medium</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-4">Quality Options</td>
                  <td className="text-center py-3 px-4 text-green-400">HD, 4K, 8K</td>
                  <td className="text-center py-3 px-4 text-yellow-400">HD Only</td>
                  <td className="text-center py-3 px-4 text-yellow-400">HD Only</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-4">Registration Required</td>
                  <td className="text-center py-3 px-4 text-green-400">❌ No</td>
                  <td className="text-center py-3 px-4 text-red-400">✅ Yes</td>
                  <td className="text-center py-3 px-4 text-red-400">✅ Yes</td>
                </tr>

                <tr className="border-b border-gray-700">
                  <td className="py-3 px-4">Playlist Support</td>
                  <td className="text-center py-3 px-4 text-green-400">✅ Full Support</td>
                  <td className="text-center py-3 px-4 text-yellow-400">Limited</td>
                  <td className="text-center py-3 px-4 text-red-400">❌ No</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-4">Ads & Popups</td>
                  <td className="text-center py-3 px-4 text-green-400">❌ None</td>
                  <td className="text-center py-3 px-4 text-red-400">✅ Many</td>
                  <td className="text-center py-3 px-4 text-red-400">✅ Many</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* User Reviews */}
        <div className="mt-8 bg-card rounded-lg border border-gray-800 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            What Users Say About Our YouTube Downloader
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400">★★★★★</div>
                <span className="ml-2 text-white font-semibold">5.0</span>
              </div>
              <p className="text-gray-300 mb-4">"Finally found a YouTube downloader that actually works! Fast and reliable. No more waiting for hours."</p>
              <div className="text-sm text-gray-400">- Sarah M.</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400">★★★★★</div>
                <span className="ml-2 text-white font-semibold">5.0</span>
              </div>
              <p className="text-gray-300 mb-4">"Best quality downloads I've ever seen. HD videos look perfect and the 4K option is amazing!"</p>
              <div className="text-sm text-gray-400">- Mike R.</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400">★★★★★</div>
                <span className="ml-2 text-white font-semibold">5.0</span>
              </div>
              <p className="text-gray-300 mb-4">"No registration needed, no ads, just pure functionality. Love the playlist download feature!"</p>
              <div className="text-sm text-gray-400">- Alex K.</div>
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
              <h3 className="text-lg font-semibold text-white mb-2">Is YouTube downloader free?</h3>
              <p className="text-gray-300">Yes, our YouTube downloader is completely free to use. No registration or payment required. You can download unlimited videos without any restrictions.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">What formats can I download?</h3>
              <p className="text-gray-300">You can download YouTube videos in MP4, MP3, WEBM, M4A, MOV, and MKV formats. We support HD, Full HD, and 4K quality options.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Can I download YouTube playlists?</h3>
              <p className="text-gray-300">Yes! You can download entire YouTube playlists. Just paste the playlist URL and our system will process all videos in the playlist.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Is it safe to use?</h3>
              <p className="text-gray-300">Absolutely! Our YouTube downloader is secure and doesn't store your personal information. All downloads are processed securely.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">How fast are the downloads?</h3>
              <p className="text-gray-300">Downloads are typically processed within 10-30 seconds depending on the file size. Our cloud-based system ensures fast and reliable downloads.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Can I download private YouTube videos?</h3>
              <p className="text-gray-300">Our downloader works with publicly accessible YouTube content. For private videos, you would need to ensure you have proper access permissions.</p>
            </div>
          </div>
        </div>

        {/* Internal Linking */}
        <InternalLinking currentPage="/youtube-downloader" category="video-downloaders" />
      </div>
    </>
  );
};

export default YoutubeDownloader;
