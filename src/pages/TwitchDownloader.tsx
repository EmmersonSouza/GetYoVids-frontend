import React from "react";
import { ToolPage } from "../components/ToolPage";
import { sidebarConfig } from "../config/sidebarConfig";
import BannerAd from "../components/BannerAd";
import { InternalLinking } from "../components/InternalLinking";

const TwitchDownloader = () => {
  const config = sidebarConfig[0].items.find(item => item.path === "/twitch-downloader")!;
  
  return (
    <>
      <ToolPage 
        title={config.title}
        description={config.description}
        placeholder="Paste Twitch URL here (e.g., https://www.twitch.tv/clips/...)"
        buttonText="Download"
        showFormatOptions={true}
      />
      <BannerAd />

      {/* Additional Banner Ad */}
      <BannerAd />

      {/* SEO Content Section */}
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Features Section */}
        <div className="mt-12 bg-card rounded-lg border border-gray-800 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Twitch Downloader Features
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">🎥 Multiple Formats</h3>
              <ul className="space-y-2">
                <li>• MP4 (HD, Full HD)</li>
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
            How to Download Twitch Clips and Highlights
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Step 1: Copy Twitch URL</h3>
              <p>Navigate to the Twitch clip or highlight you want to download and copy the URL from your browser's address bar or use the share button to copy the link.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Step 2: Paste and Select Format</h3>
              <p>Paste the Twitch URL into our downloader above and select your preferred format (MP4, MP3, etc.) and quality. We support HD and Full HD quality for clips and highlights.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Step 3: Download Your Clip</h3>
              <p>Click the download button and wait for processing. Our cloud-based system ensures fast downloads without server overload. You'll get a direct download link.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Step 4: Enjoy Your Content</h3>
              <p>Your Twitch clip or highlight is now ready for offline viewing. All files are automatically cleaned up after 24 hours for privacy.</p>
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
              <h3 className="text-lg font-semibold text-white mb-2">Is Twitch downloader free?</h3>
              <p className="text-gray-300">Yes, our Twitch downloader is completely free to use. No registration or payment required. You can download unlimited videos without any restrictions.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">What formats can I download?</h3>
              <p className="text-gray-300">You can download Twitch videos in MP4, MP3, WEBM, M4A, MOV, and MKV formats. We support HD and Full HD quality options.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Can I download private Twitch videos?</h3>
              <p className="text-gray-300">Our downloader works with publicly accessible Twitch content. For private videos, you would need to ensure you have proper access permissions.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Is it safe to use?</h3>
              <p className="text-gray-300">Absolutely! Our Twitch downloader is secure and doesn't store your personal information. All downloads are processed securely.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">How fast are the downloads?</h3>
              <p className="text-gray-300">Downloads are typically processed within 10-30 seconds depending on the file size. Our cloud-based system ensures fast and reliable downloads.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Can I download Twitch clips?</h3>
              <p className="text-gray-300">Yes! Our Twitch downloader supports downloading Twitch clips and highlights in high quality. VODs are not supported to prevent large file downloads.</p>
            </div>
          </div>
        </div>

        {/* Internal Linking */}
        <InternalLinking currentPage="/twitch-downloader" category="video-downloaders" />
      </div>

      {/* Bottom Banner Ad */}
      <BannerAd />
    </>
  );
};

export default TwitchDownloader;
