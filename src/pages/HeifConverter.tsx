import ConverterPage from "../components/ConverterPage";
import { sidebarConfig } from "../config/sidebarConfig";
import BannerAd from "../components/BannerAd";

const HeifConverter = () => {
  const config = sidebarConfig[2]?.items?.[0]?.children?.find(item => item.path === "/heif-converter");
  
  const fallbackConfig = {
    path: "/heif-converter",
    label: "HEIF Converter",
    title: "Convert HEIF/HEIC Images - Free Online HEIF Converter",
    description: "Convert HEIF and HEIC images to PNG, JPEG, WebP and other formats. Free online HEIF converter for iOS photos.",
    keywords: "heif converter, heic converter, convert heif, heic to jpeg, ios photo converter",
    canonical: "https://getyovids.com/image-converter/heif"
  };
  
  const finalConfig = config || fallbackConfig;

  return (
    <>
      <ConverterPage 
        config={finalConfig}
        supportedInputFormats={["HEIF", "HEIC"]}
        supportedOutputFormats={["PNG", "JPEG", "JPG", "WEBP", "BMP", "TIFF"]}
        acceptedFileTypes="image/heif,image/heic,.heif,.heic"
        maxFileSize="25MB"
      />
      <BannerAd />

      {/* Additional Banner Ad */}
      <BannerAd />
    </>
  );
};

export default HeifConverter; 