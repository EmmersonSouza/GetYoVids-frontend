import ConverterPage from "../components/ConverterPage";
import { sidebarConfig } from "../config/sidebarConfig";
import BannerAd from "../components/BannerAd";

const WebmConverter = () => {
  // More robust config finding with debugging
  const config = sidebarConfig[2]?.items?.[1]?.children?.find(item => item.path === "/webm-converter");
  
  // Fallback config if not found in sidebar
  const fallbackConfig = {
    path: "/webm-converter",
    label: "WEBM Converter",
    title: "Convert Videos to WEBM - Free Online WEBM Converter",
    description: "Convert videos to WEBM format. Free online WEBM converter with high quality output.",
    keywords: "webm converter, convert to webm, video to webm, mp4 to webm",
    canonical: "https://getyovids.com/video-converter/webm"
  };
  
  const finalConfig = config || fallbackConfig;

  return (
    <>
      <ConverterPage 
        config={finalConfig}
        supportedInputFormats={["WEBM"]}
        supportedOutputFormats={["MP4", "AVI", "MKV", "MOV", "WMV", "FLV", "3GP", "M4V"]}
        acceptedFileTypes="video/webm,.webm"
        maxFileSize="200MB"
      />
      <BannerAd />

      {/* Additional Banner Ad */}
      <BannerAd />
    </>
  );
};

export default WebmConverter; 