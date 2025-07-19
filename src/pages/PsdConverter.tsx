import ConverterPage from "../components/ConverterPage";
import { sidebarConfig } from "../config/sidebarConfig";
import BannerAd from "../components/BannerAd";

const PsdConverter = () => {
  const config = sidebarConfig[2]?.items?.[0]?.children?.find(item => item.path === "/psd-converter");
  
  const fallbackConfig = {
    path: "/psd-converter",
    label: "PSD Converter",
    title: "Convert PSD Files - Free Online PSD Converter",
    description: "Convert Photoshop PSD files to PNG, JPEG, WebP, TIFF and other formats. Free online PSD converter for Photoshop files.",
    keywords: "psd converter, photoshop converter, convert psd, psd to png, psd to jpeg",
    canonical: "https://getyovids.com/image-converter/psd"
  };
  
  const finalConfig = config || fallbackConfig;

  return (
    <>
      <ConverterPage 
        config={finalConfig}
        supportedInputFormats={["PSD"]}
        supportedOutputFormats={["PNG", "JPEG", "JPG", "WEBP", "TIFF", "BMP"]}
        acceptedFileTypes="image/vnd.adobe.photoshop,.psd"
        maxFileSize="100MB"
      />
      <BannerAd />

      {/* Additional Banner Ad */}
      <BannerAd />
    </>
  );
};

export default PsdConverter; 