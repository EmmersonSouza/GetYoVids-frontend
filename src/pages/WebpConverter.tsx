import ConverterPage from "../components/ConverterPage";
import { sidebarConfig } from "../config/sidebarConfig";
import BannerAd from "../components/BannerAd";

const WebpConverter = () => {
  const config = sidebarConfig[2].items[0].children?.find(item => item.path === "/webp-converter");

  if (!config) {
    return <div>Configuration for WEBP Converter not found.</div>;
  }
  
  return (
    <>
      <ConverterPage 
        config={config}
        supportedInputFormats={["WEBP"]}
        supportedOutputFormats={["PNG", "JPG", "JPEG", "GIF", "BMP", "TIFF", "TGA", "EXR", "ICO"]}
        acceptedFileTypes="image/webp,.webp"
        maxFileSize="50MB"
      />
      <BannerAd />

      {/* Additional Banner Ad */}
      <BannerAd />
    </>
  );
};

export default WebpConverter;
