import ConverterPage from "../components/ConverterPage";
import { sidebarConfig } from "../config/sidebarConfig";
import BannerAd from "../components/BannerAd";

const AacConverter = () => {
  const config = sidebarConfig[2].items[2].children?.find(item => item.path === "/aac-converter");
  
  if (!config) {
    return <div>Configuration for AAC Converter not found.</div>;
  }

  return (
    <>
      <ConverterPage 
        config={config}
        supportedInputFormats={["AAC"]}
        supportedOutputFormats={["MP3", "WAV", "FLAC", "OGG", "M4A", "WMA", "AIFF", "AMR"]}
        acceptedFileTypes="audio/aac,.aac"
        maxFileSize="200MB"
      />
      <BannerAd />

      {/* Additional Banner Ad */}
      <BannerAd />
    </>
  );
};

export default AacConverter; 