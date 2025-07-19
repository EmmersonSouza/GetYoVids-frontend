
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import CleanRouteAd from "./ads/CleanRouteAds";
import AdultRouteAd from "./ads/AdultRouteAds";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine if current route is adult content
  const isAdultRoute = [
    '/pornhub-downloader',
    '/xvideos-downloader', 
    '/xhamster-downloader',
    '/redgifs-downloader',
    '/youporn-downloader',
    '/spankbang-downloader'
  ].includes(location.pathname);

  // Choose the appropriate ad component
  const AdComponent = isAdultRoute ? AdultRouteAd : CleanRouteAd;

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content area with vertical ads */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Banner Ad - Above the fold */}
        <div className="bg-sidebar border-b border-gray-800 p-2">
          <AdComponent size="970x90" />
        </div>

        {/* Header */}
        <header className="bg-background border-b border-gray-800 px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <Menu size={24} />
            </button>
            <div className="text-sm text-gray-400 text-center flex-1 lg:text-left">
              GetYoVids.com - Free Video Downloader & Converter Platform
            </div>
          </div>
        </header>

        {/* Content area with vertical ads */}
        <div className="flex-1 flex">
          {/* Left vertical ad space - multiple 160x600 ads */}
          <div className="hidden xl:block w-48 2xl:w-56 bg-sidebar border-r border-gray-800 p-4 space-y-4">
            <AdComponent size="160x600" />
            <AdComponent size="160x600" />
            <AdComponent size="160x600" />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <main className="flex-1 p-4 lg:p-6">
              {children}
            </main>
          </div>

          {/* Right vertical ad space - multiple 160x600 ads */}
          <div className="hidden xl:block w-48 2xl:w-56 bg-sidebar border-l border-gray-800 p-4 space-y-4">
            <AdComponent size="160x600" />
            <AdComponent size="160x600" />
            <AdComponent size="160x600" />
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-sidebar border-t border-gray-800 px-4 py-6 lg:px-6">
          <div className="text-center text-sm text-gray-400">
            <p>&copy; 2024 GetYoVids.com - Free Video Downloader Platform</p>
            <p className="mt-1">Download videos from YouTube, TikTok, Instagram and more. Convert files to various formats.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
