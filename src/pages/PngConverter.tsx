import ConverterPage from "../components/ConverterPage";
import { sidebarConfig } from "../config/sidebarConfig";
import BannerAd from "../components/BannerAd";

const PngConverter = () => {
  const config = sidebarConfig[2].items[0].children?.find(item => item.path === "/png-converter");

  if (!config) {
    return <div>Configuration for PNG Converter not found.</div>;
  }
  
  return (
    <>
      <ConverterPage 
        config={config}
        supportedInputFormats={["PNG"]}
        supportedOutputFormats={["JPG", "JPEG", "WEBP", "GIF", "BMP", "TIFF", "TGA", "EXR", "ICO"]}
        acceptedFileTypes="image/png,.png"
        maxFileSize="50MB"
      />
      <BannerAd />

      {/* Additional Banner Ad */}
      <BannerAd />
    </>
  );
};

export default PngConverter;
