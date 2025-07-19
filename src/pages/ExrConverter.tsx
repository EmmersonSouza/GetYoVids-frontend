import ConverterPage from "../components/ConverterPage";
import { sidebarConfig } from "../config/sidebarConfig";
import BannerAd from "../components/BannerAd";

const ExrConverter = () => {
  const config = sidebarConfig[2]?.items?.[0]?.children?.find(item => item.path === "/exr-converter");
  
  const fallbackConfig = {
    path: "/exr-converter",
    label: "EXR Converter",
    title: "Convert EXR Images - Free Online EXR Converter",
    description: "Convert EXR high dynamic range images to PNG, JPEG, WebP, TIFF and other formats. Free online EXR converter with high quality output.",
    keywords: "exr converter, convert exr, exr to png, exr to jpeg, hdr converter",
    canonical: "https://getyovids.com/image-converter/exr"
  };
  
  const finalConfig = config || fallbackConfig;

  return (
    <>
      <ConverterPage 
        config={finalConfig}
        supportedInputFormats={["EXR"]}
        supportedOutputFormats={["PNG", "JPEG", "JPG", "WEBP", "TIFF", "BMP", "TGA"]}
        acceptedFileTypes="image/x-exr,.exr"
        maxFileSize="200MB"
      />
      <BannerAd />

      {/* Additional Banner Ad */}
      <BannerAd />
    </>
  );
};

export default ExrConverter; 