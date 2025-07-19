
import { Helmet } from "react-helmet-async";
import { NavLink } from "react-router-dom";
import { sidebarConfig } from "../config/sidebarConfig";
import { Download, Music, Headphones } from "lucide-react";
import AdSpace from "../components/AdSpace";

const HomePage = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Download":
        return <Download size={24} />;
      case "Music":
        return <Music size={24} />;
      case "Headphones":
        return <Headphones size={24} />;
      default:
        return <Download size={24} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>GetYoVids.com - Free Video Downloader & Converter Platform</title>
        <meta name="description" content="Download videos from YouTube, TikTok, and more. Convert videos to MP3, extract audio, and save content for offline viewing. Free and fast video downloader." />
        <meta name="keywords" content="video downloader, youtube downloader, tiktok downloader, video converter, mp3 converter, free video download" />
        <link rel="canonical" href="https://getyovids.com/" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "GetYoVids.com",
            "description": "Free video downloader and converter platform",
            "url": "https://getyovids.com/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://getyovids.com/?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            GetYoVids.com
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Free video downloader and converter platform. Download from YouTube, TikTok, and more. 
            Convert videos to MP3 and extract audio with ease.
          </p>
        </div>

        {/* Top Horizontal Ad Space */}
        <div className="mb-12">
          <AdSpace type="horizontal" size="728x90" />
        </div>

        {/* Tools Grid */}
        <div className="space-y-12">
          {sidebarConfig.map((section, sectionIndex) => (
            <div key={section.title}>
              <h2 className="text-2xl font-bold text-white mb-6">{section.title}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items.map((tool, toolIndex) => (
                  <NavLink
                    key={`${section.title}-${toolIndex}`}
                    to={tool.path!}
                    className="bg-card hover:bg-gray-800 border border-gray-700 rounded-lg p-6 transition-colors group"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-primary group-hover:text-white transition-colors">
                        {getIcon(tool.icon)}
                      </div>
                      <h3 className="text-lg font-semibold text-white">
                        {tool.label}
                      </h3>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {tool.description}
                    </p>
                  </NavLink>
                ))}
              </div>
              
              {/* Add horizontal ad after each section (except the last one) */}
              {sectionIndex < sidebarConfig.length - 1 && (
                <div className="mt-8 mb-8">
                  <AdSpace type="horizontal" size="728x90" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Middle Horizontal Ad Space */}
        <div className="my-12">
          <AdSpace type="horizontal" size="970x90" />
        </div>

        {/* SEO Content */}
        <div className="mt-16 bg-card rounded-lg border border-gray-800 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Why Choose GetYoVids.com?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Free & Fast</h3>
              <p>Download and convert videos completely free with no registration required. Our tools are optimized for speed and efficiency.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">High Quality</h3>
              <p>Get the best possible quality for your downloads and conversions. Support for HD video and high-bitrate audio.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Multiple Platforms</h3>
              <p>Download from YouTube, TikTok, and many other popular video platforms. All in one convenient location.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Secure & Private</h3>
              <p>Your downloads are processed securely and we don't store your personal information or downloaded content.</p>
            </div>
          </div>
        </div>

        {/* Bottom Horizontal Ad Space */}
        <div className="mt-12">
          <AdSpace type="horizontal" size="728x90" />
        </div>
      </div>
    </>
  );
};

export default HomePage;
