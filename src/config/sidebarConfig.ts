
export interface SidebarItem {
  path?: string;
  label: string;
  icon?: string;
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  children?: SidebarItem[];
}

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export const sidebarConfig: SidebarSection[] = [
  {
    title: "📺 Video Downloaders",
    items: [
      {
        path: "/youtube-downloader",
        label: "YouTube Downloader",
        icon: "Download",
        title: "Download YouTube Videos - Free HD, as MP4, MP3 & More Formats",
        description: "Download YouTube videos in HD quality as MP4, MP3, and other formats for free. Fast, secure YouTube video downloader with playlist support.",
        keywords: "youtube downloader, download youtube videos, youtube to mp4, youtube to mp3, free youtube downloader, HD video download",
        canonical: "https://getyovids.com/youtube-downloader"
      },
      {
        path: "/tiktok-downloader",
        label: "TikTok Downloader",
        icon: "Download",
        title: "Download TikTok Videos Without Watermark - Free TikTok Downloader",
        description: "Download TikTok videos without watermark in HD quality. Save TikTok videos to your device for free.",
        keywords: "tiktok downloader, download tiktok videos, tiktok without watermark, save tiktok videos",
        canonical: "https://getyovids.com/tiktok-downloader"
      },
      {
        path: "/instagram-downloader",
        label: "Instagram Downloader",
        icon: "Download",
        title: "Download Instagram Videos and Reels - Free Instagram Downloader",
        description: "Download Instagram videos, reels, and IGTV content in high quality. Free Instagram video downloader.",
        keywords: "instagram downloader, download instagram videos, instagram reels downloader, save instagram videos",
        canonical: "https://getyovids.com/instagram-downloader"
      },
      {
        path: "/twitter-downloader",
        label: "Twitter/X Downloader",
        icon: "Download",
        title: "Download Twitter Videos - Free X Video Downloader",
        description: "Download Twitter/X videos and GIFs in high quality. Fast and free Twitter video downloader.",
        keywords: "twitter downloader, x video downloader, download twitter videos, save twitter videos",
        canonical: "https://getyovids.com/twitter-downloader"
      },
      {
        path: "/vimeo-downloader",
        label: "Vimeo Downloader",
        icon: "Download",
        title: "Download Vimeo Videos - Free Vimeo Video Downloader",
        description: "Download Vimeo videos in HD quality. Free and easy-to-use Vimeo video downloader.",
        keywords: "vimeo downloader, download vimeo videos, vimeo to mp4, save vimeo videos",
        canonical: "https://getyovids.com/vimeo-downloader"
      },
      {
        path: "/facebook-downloader",
        label: "Facebook Downloader",
        icon: "Download",
        title: "Download Facebook Videos - Free Facebook Video Downloader",
        description: "Download Facebook videos in high quality. Save Facebook videos to your device for free.",
        keywords: "facebook downloader, download facebook videos, save facebook videos, facebook video saver",
        canonical: "https://getyovids.com/facebook-downloader"
      },
      {
        path: "/twitch-downloader",
        label: "Twitch Downloader",
        icon: "Download",
        title: "Download Twitch Clips and Highlights - Free Twitch Downloader",
        description: "Download Twitch clips, and highlights. Free Twitch video downloader.",
        keywords: "twitch downloader, download twitch clips, twitch highlights downloader, save twitch videos",
        canonical: "https://getyovids.com/twitch-downloader"
      },
      {
        path: "/reddit-downloader",
        label: "Reddit Downloader",
        icon: "Download",
        title: "Download Reddit Videos - Free Reddit Video Downloader",
        description: "Download Reddit videos and GIFs in high quality. Save Reddit content to your device.",
        keywords: "reddit downloader, download reddit videos, save reddit videos, reddit video saver",
        canonical: "https://getyovids.com/reddit-downloader"
      }
    ]
  },
  {
    title: "🔞 Adult Video Downloaders",
    items: [
      {
        path: "/pornhub-downloader",
        label: "Pornhub Downloader",
        icon: "Download",
        title: "Download Pornhub Videos - Free Adult Video Downloader",
        description: "Download Pornhub videos in various formats and qualities. Free, fast, and secure adult video downloader.",
        keywords: "pornhub downloader, download pornhub videos, adult video downloader, pornhub to mp4",
        canonical: "https://getyovids.com/pornhub-downloader"
      },
      {
        path: "/xvideos-downloader",
        label: "Xvideos Downloader",
        icon: "Download",
        title: "Download Xvideos Videos - Free Adult Video Downloader",
        description: "Download Xvideos content in high quality. Free and secure adult video downloader.",
        keywords: "xvideos downloader, download xvideos videos, adult video downloader, xvideos to mp4",
        canonical: "https://getyovids.com/xvideos-downloader"
      },
      {
        path: "/xhamster-downloader",
        label: "Xhamster Downloader",
        icon: "Download",
        title: "Download Xhamster Videos - Free Adult Video Downloader",
        description: "Download Xhamster videos in various formats. Free and secure adult content downloader.",
        keywords: "xhamster downloader, download xhamster videos, adult video downloader, xhamster to mp4",
        canonical: "https://getyovids.com/xhamster-downloader"
      },
      {
        path: "/redgifs-downloader",
        label: "RedGifs Downloader",
        icon: "Download",
        title: "Download RedGifs Videos - Free GIF and Video Downloader",
        description: "Download RedGifs content in high quality. Save GIFs and videos from RedGifs.",
        keywords: "redgifs downloader, download redgifs videos, redgifs gif downloader, save redgifs content",
        canonical: "https://getyovids.com/redgifs-downloader"
      },
      {
        path: "/youporn-downloader",
        label: "YouPorn Downloader",
        icon: "Download",
        title: "Download YouPorn Videos - Free Adult Video Downloader",
        description: "Download YouPorn videos in various qualities. Free and secure adult video downloader.",
        keywords: "youporn downloader, download youporn videos, adult video downloader, youporn to mp4",
        canonical: "https://getyovids.com/youporn-downloader"
      },
      {
        path: "/spankbang-downloader",
        label: "SpankBang Downloader",
        icon: "Download",
        title: "Download SpankBang Videos - Free Adult Video Downloader",
        description: "Download SpankBang videos in high quality. Free and secure adult content downloader.",
        keywords: "spankbang downloader, download spankbang videos, adult video downloader, spankbang to mp4",
        canonical: "https://getyovids.com/spankbang-downloader"
      }
    ]
  },
  {
    title: "🔄 Format Converters",
    items: [
      {
        label: "Image Converter",
        icon: "image",
        children: [
          {
            path: "/png-converter",
            label: "PNG Converter",
            title: "Convert Images to PNG - Free Online PNG Converter",
            description: "Convert images to PNG format. Free online PNG converter with high quality output.",
            keywords: "png converter, convert to png, image to png",
            canonical: "https://getyovids.com/image-converter/png"
          },
          {
            path: "/jpeg-converter",
            label: "JPEG Converter",
            title: "Convert Images to JPEG - Free Online JPEG Converter",
            description: "Convert images to JPEG format. Free online JPEG converter with high quality output.",
            keywords: "jpeg converter, convert to jpeg, image to jpeg",
            canonical: "https://getyovids.com/image-converter/jpeg"
          },
          {
            path: "/webp-converter",
            label: "WEBP Converter",
            title: "Convert Images to WEBP - Free Online WEBP Converter",
            description: "Convert images to WEBP format. Free online WEBP converter with high quality output.",
            keywords: "webp converter, convert to webp, image to webp",
            canonical: "https://getyovids.com/image-converter/webp"
          },
          {
            path: "/gif-converter",
            label: "GIF Converter",
            title: "Convert GIF Images - Free Online GIF Converter",
            description: "Convert GIF images to PNG, JPEG, WebP and other formats. Free online GIF converter with high quality output.",
            keywords: "gif converter, convert gif, gif to png, gif to jpeg, gif to webp",
            canonical: "https://getyovids.com/image-converter/gif"
          },
          {
            path: "/bmp-converter",
            label: "BMP Converter",
            title: "Convert BMP Images - Free Online BMP Converter",
            description: "Convert BMP images to PNG, JPEG, WebP and other formats. Free online BMP converter with high quality output.",
            keywords: "bmp converter, convert bmp, bmp to png, bmp to jpeg, bmp to webp",
            canonical: "https://getyovids.com/image-converter/bmp"
          },
          {
            path: "/tiff-converter",
            label: "TIFF Converter",
            title: "Convert TIFF Images - Free Online TIFF Converter",
            description: "Convert TIFF images to PNG, JPEG, WebP and other formats. Free online TIFF converter with high quality output.",
            keywords: "tiff converter, convert tiff, tiff to png, tiff to jpeg, tiff to webp",
            canonical: "https://getyovids.com/image-converter/tiff"
          },
          {
            path: "/tga-converter",
            label: "TGA Converter",
            title: "Convert TGA Images - Free Online TGA Converter",
            description: "Convert TGA images to PNG, JPEG, WebP and other formats. Free online TGA converter with high quality output.",
            keywords: "tga converter, convert tga, tga to png, tga to jpeg, tga to webp",
            canonical: "https://getyovids.com/image-converter/tga"
          },
          {
            path: "/exr-converter",
            label: "EXR Converter",
            title: "Convert EXR Images - Free Online EXR Converter",
            description: "Convert EXR high dynamic range images to PNG, JPEG, WebP and other formats. Free online EXR converter.",
            keywords: "exr converter, convert exr, exr to png, exr to jpeg, hdr converter",
            canonical: "https://getyovids.com/image-converter/exr"
          },
          {
            path: "/heif-converter",
            label: "HEIF Converter",
            title: "Convert HEIF/HEIC Images - Free Online HEIF Converter",
            description: "Convert HEIF and HEIC images to PNG, JPEG, WebP and other formats. Free online HEIF converter for iOS photos.",
            keywords: "heif converter, heic converter, convert heif, heic to jpeg, ios photo converter",
            canonical: "https://getyovids.com/image-converter/heif"
          },
          {
            path: "/ico-converter",
            label: "ICO Converter",
            title: "Convert ICO Icons - Free Online ICO Converter",
            description: "Convert ICO icon files to PNG, JPEG, WebP and other formats. Free online ICO converter for Windows icons.",
            keywords: "ico converter, icon converter, convert ico, ico to png, windows icon converter",
            canonical: "https://getyovids.com/image-converter/ico"
          },
          {
            path: "/psd-converter",
            label: "PSD Converter",
            title: "Convert PSD Files - Free Online PSD Converter",
            description: "Convert Photoshop PSD files to PNG, JPEG, WebP and other formats. Free online PSD converter for Photoshop files.",
            keywords: "psd converter, photoshop converter, convert psd, psd to png, psd to jpeg",
            canonical: "https://getyovids.com/image-converter/psd"
          }
        ]
      },
      {
        label: "Video Converter",
        icon: "file-video",
        children: [
          {
            path: "/mp4-converter",
            label: "MP4 Converter",
            title: "Convert Videos to MP4 - Free Online MP4 Converter",
            description: "Convert videos to MP4 format. Free online MP4 converter with high quality output.",
            keywords: "mp4 converter, convert to mp4, video to mp4, avi to mp4, mov to mp4",
            canonical: "https://getyovids.com/video-converter/mp4"
          },
          {
            path: "/avi-converter",
            label: "AVI Converter",
            title: "Convert Videos to AVI - Free Online AVI Converter",
            description: "Convert videos to AVI format. Free online AVI converter with high quality output.",
            keywords: "avi converter, convert to avi, video to avi, mp4 to avi",
            canonical: "https://getyovids.com/video-converter/avi"
          },
          {
            path: "/mov-converter",
            label: "MOV Converter",
            title: "Convert Videos to MOV - Free Online MOV Converter",
            description: "Convert videos to MOV format. Free online MOV converter with high quality output.",
            keywords: "mov converter, convert to mov, video to mov, mp4 to mov",
            canonical: "https://getyovids.com/video-converter/mov"
          },
          {
            path: "/webm-converter",
            label: "WEBM Converter",
            title: "Convert Videos to WEBM - Free Online WEBM Converter",
            description: "Convert videos to WEBM format. Free online WEBM converter with high quality output.",
            keywords: "webm converter, convert to webm, video to webm, mp4 to webm",
            canonical: "https://getyovids.com/video-converter/webm"
          },
          {
            path: "/mkv-converter",
            label: "MKV Converter",
            title: "Convert Videos to MKV - Free Online MKV Converter",
            description: "Convert videos to MKV format. Free online MKV converter with high quality output.",
            keywords: "mkv converter, convert to mkv, video to mkv, mp4 to mkv",
            canonical: "https://getyovids.com/video-converter/mkv"
          }
        ]
      },
      {
        label: "Audio Converter",
        icon: "file-audio",
        children: [
          {
            path: "/mp3-converter",
            label: "MP3 Converter",
            title: "Convert Audio to MP3 - Free Online MP3 Converter",
            description: "Convert audio files to MP3 format. Free online MP3 converter with high quality output.",
            keywords: "mp3 converter, convert to mp3, audio to mp3, wav to mp3, flac to mp3",
            canonical: "https://getyovids.com/audio-converter/mp3"
          },
          {
            path: "/wav-converter",
            label: "WAV Converter",
            title: "Convert Audio to WAV - Free Online WAV Converter",
            description: "Convert audio files to WAV format. Free online WAV converter with high quality output.",
            keywords: "wav converter, convert to wav, audio to wav, mp3 to wav",
            canonical: "https://getyovids.com/audio-converter/wav"
          },
          {
            path: "/flac-converter",
            label: "FLAC Converter",
            title: "Convert Audio to FLAC - Free Online FLAC Converter",
            description: "Convert audio files to FLAC format. Free online lossless FLAC converter.",
            keywords: "flac converter, convert to flac, audio to flac, mp3 to flac, lossless audio",
            canonical: "https://getyovids.com/audio-converter/flac"
          },
          {
            path: "/aac-converter",
            label: "AAC Converter",
            title: "Convert Audio to AAC - Free Online AAC Converter",
            description: "Convert audio files to AAC format. Free online AAC converter with high quality output.",
            keywords: "aac converter, convert to aac, audio to aac, mp3 to aac",
            canonical: "https://getyovids.com/audio-converter/aac"
          },
          {
            path: "/ogg-converter",
            label: "OGG Converter",
            title: "Convert Audio to OGG - Free Online OGG Converter",
            description: "Convert audio files to OGG format. Free online OGG converter with high quality output.",
            keywords: "ogg converter, convert to ogg, audio to ogg, mp3 to ogg",
            canonical: "https://getyovids.com/audio-converter/ogg"
          }
        ]
      }
    ]
  }
];
