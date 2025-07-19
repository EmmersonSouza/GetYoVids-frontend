import ConverterPage from "../components/ConverterPage";
import { sidebarConfig } from "../config/sidebarConfig";
import BannerAd from "../components/BannerAd";

const MovConverter = () => {
  const config = sidebarConfig[2].items[1].children?.find(item => item.path === "/mov-converter");
  
  if (!config) {
    return <div>Configuration for MOV Converter not found.</div>;
  }

  return (
    <>
      <ConverterPage 
        config={config}
        supportedInputFormats={["MOV"]}
        supportedOutputFormats={["MP4", "AVI", "MKV", "WEBM", "WMV", "FLV", "3GP", "M4V"]}
        acceptedFileTypes="video/quicktime,.mov"
        maxFileSize="200MB"
      />
      <BannerAd />

      {/* Additional Banner Ad */}
      <BannerAd />
    </>
  );
};

export default MovConverter; 