import ConverterPage from "../components/ConverterPage";
import { sidebarConfig } from "../config/sidebarConfig";
import BannerAd from "../components/BannerAd";

const AviConverter = () => {
  const config = sidebarConfig[2].items[1].children?.find(item => item.path === "/avi-converter");
  
  if (!config) {
    return <div>Configuration for AVI Converter not found.</div>;
  }

  return (
    <>
      <ConverterPage 
        config={config}
        supportedInputFormats={["AVI"]}
        supportedOutputFormats={["MP4", "MKV", "MOV", "WEBM", "WMV", "FLV", "3GP", "M4V"]}
        acceptedFileTypes="video/x-msvideo,.avi"
        maxFileSize="200MB"
      />
      <BannerAd />

      {/* Additional Banner Ad */}
      <BannerAd />
    </>
  );
};

export default AviConverter; 