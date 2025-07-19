import ConverterPage from "../components/ConverterPage";
import { sidebarConfig } from "../config/sidebarConfig";
import BannerAd from "../components/BannerAd";

const Mp4Converter = () => {
  const config = sidebarConfig[2].items[1].children?.find(item => item.path === "/mp4-converter");
  
  if (!config) {
    return <div>Configuration for MP4 Converter not found.</div>;
  }

  return (
    <>
      <ConverterPage 
        config={config}
        supportedInputFormats={["MP4"]}
        supportedOutputFormats={["AVI", "MKV", "MOV", "WEBM", "WMV", "FLV", "3GP", "M4V"]}
        acceptedFileTypes="video/mp4,.mp4"
        maxFileSize="200MB"
      />
      <BannerAd />

      {/* Additional Banner Ad */}
      <BannerAd />
    </>
  );
};

export default Mp4Converter; 