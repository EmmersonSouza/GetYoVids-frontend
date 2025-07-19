import ConverterPage from "../components/ConverterPage";
import { sidebarConfig } from "../config/sidebarConfig";
import BannerAd from "../components/BannerAd";

const BmpConverter = () => {
  const config = sidebarConfig[2]?.items?.[0]?.children?.find(item => item.path === "/bmp-converter");
  
  const fallbackConfig = {
    path: "/bmp-converter",
    label: "BMP Converter",
    title: "Convert BMP Images - Free Online BMP Converter",
    description: "Convert BMP images to PNG, JPEG, WebP, GIF, TIFF and other formats. Free online BMP converter with high quality output.",
    keywords: "bmp converter, convert bmp, bmp to png, bmp to jpeg, bmp to webp",
    canonical: "https://getyovids.com/image-converter/bmp"
  };
  
  const finalConfig = config || fallbackConfig;

  return (
    <>
      <ConverterPage 
        config={finalConfig}
        supportedInputFormats={["BMP"]}
        supportedOutputFormats={["PNG", "JPEG", "JPG", "WEBP", "GIF", "TIFF", "TGA", "ICO"]}
        acceptedFileTypes="image/bmp,.bmp"
        maxFileSize="50MB"
      />
      <BannerAd />

      {/* Additional Banner Ad */}
      <BannerAd />
    </>
  );
};

export default BmpConverter; 