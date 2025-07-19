import React from "react";
import { NavLink } from "react-router-dom";

interface InternalLinkingProps {
  currentPage: string;
  category: 'video-downloaders' | 'adult-downloaders' | 'image-converters' | 'video-converters' | 'audio-converters';
}

export const InternalLinking: React.FC<InternalLinkingProps> = ({ currentPage, category }) => {
  const getRelatedTools = () => {
    switch (category) {
      case 'video-downloaders':
        return [
          { path: '/youtube-downloader', label: 'YouTube Downloader', description: 'Download YouTube videos' },
          { path: '/tiktok-downloader', label: 'TikTok Downloader', description: 'Download TikTok videos' },
          { path: '/instagram-downloader', label: 'Instagram Downloader', description: 'Download Instagram content' },
          { path: '/twitter-downloader', label: 'Twitter Downloader', description: 'Download Twitter videos' },
          { path: '/vimeo-downloader', label: 'Vimeo Downloader', description: 'Download Vimeo videos' },
          { path: '/facebook-downloader', label: 'Facebook Downloader', description: 'Download Facebook videos' },
          { path: '/twitch-downloader', label: 'Twitch Downloader', description: 'Download Twitch content' },
          { path: '/reddit-downloader', label: 'Reddit Downloader', description: 'Download Reddit videos' }
        ];
      case 'adult-downloaders':
        return [
          { path: '/redgifs-downloader', label: 'RedGifs Downloader', description: 'Download RedGifs content' },
          { path: '/pornhub-downloader', label: 'Pornhub Downloader', description: 'Download Pornhub videos' },
          { path: '/xvideos-downloader', label: 'Xvideos Downloader', description: 'Download Xvideos content' },
          { path: '/xhamster-downloader', label: 'Xhamster Downloader', description: 'Download Xhamster videos' },
          { path: '/youporn-downloader', label: 'YouPorn Downloader', description: 'Download YouPorn videos' },
          { path: '/spankbang-downloader', label: 'SpankBang Downloader', description: 'Download SpankBang content' }
        ];
      case 'image-converters':
        return [
          { path: '/png-converter', label: 'PNG Converter', description: 'Convert to PNG format' },
          { path: '/jpeg-converter', label: 'JPEG Converter', description: 'Convert to JPEG format' },
          { path: '/webp-converter', label: 'WEBP Converter', description: 'Convert to WEBP format' },
          { path: '/gif-converter', label: 'GIF Converter', description: 'Convert GIF images' },
          { path: '/bmp-converter', label: 'BMP Converter', description: 'Convert BMP images' },
          { path: '/tiff-converter', label: 'TIFF Converter', description: 'Convert TIFF images' },
          { path: '/tga-converter', label: 'TGA Converter', description: 'Convert TGA images' },
          { path: '/exr-converter', label: 'EXR Converter', description: 'Convert EXR images' },
          { path: '/heif-converter', label: 'HEIF Converter', description: 'Convert HEIF images' },
          { path: '/ico-converter', label: 'ICO Converter', description: 'Convert ICO icons' },
          { path: '/psd-converter', label: 'PSD Converter', description: 'Convert PSD files' }
        ];
      case 'video-converters':
        return [
          { path: '/mp4-converter', label: 'MP4 Converter', description: 'Convert to MP4 format' },
          { path: '/avi-converter', label: 'AVI Converter', description: 'Convert to AVI format' },
          { path: '/mov-converter', label: 'MOV Converter', description: 'Convert to MOV format' },
          { path: '/webm-converter', label: 'WEBM Converter', description: 'Convert to WEBM format' },
          { path: '/mkv-converter', label: 'MKV Converter', description: 'Convert to MKV format' }
        ];
      case 'audio-converters':
        return [
          { path: '/mp3-converter', label: 'MP3 Converter', description: 'Convert to MP3 format' },
          { path: '/wav-converter', label: 'WAV Converter', description: 'Convert to WAV format' },
          { path: '/flac-converter', label: 'FLAC Converter', description: 'Convert to FLAC format' },
          { path: '/aac-converter', label: 'AAC Converter', description: 'Convert to AAC format' },
          { path: '/ogg-converter', label: 'OGG Converter', description: 'Convert to OGG format' }
        ];
      default:
        return [];
    }
  };

  const relatedTools = getRelatedTools().filter(tool => tool.path !== currentPage);

  if (relatedTools.length === 0) return null;

  return (
    <div className="mt-12 bg-card rounded-lg border border-gray-800 p-8">
      <h2 className="text-2xl font-bold text-white mb-6">
        Related Tools
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedTools.slice(0, 6).map((tool) => (
          <NavLink
            key={tool.path}
            to={tool.path}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-4 transition-colors group"
          >
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
              {tool.label}
            </h3>
            <p className="text-gray-400 text-sm mt-2">
              {tool.description}
            </p>
          </NavLink>
        ))}
      </div>
      
      {/* Cross-category linking */}
      <div className="mt-8 pt-6 border-t border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          Other Categories
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NavLink
            to="/youtube-downloader"
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            Video Downloaders
          </NavLink>
          <NavLink
            to="/redgifs-downloader"
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            Adult Downloaders
          </NavLink>
          <NavLink
            to="/png-converter"
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            Image Converters
          </NavLink>
          <NavLink
            to="/mp4-converter"
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            Video Converters
          </NavLink>
        </div>
      </div>
    </div>
  );
}; 