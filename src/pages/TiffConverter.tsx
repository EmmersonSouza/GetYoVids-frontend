import ConverterPage from "../components/ConverterPage";
import { sidebarConfig } from "../config/sidebarConfig";

const TiffConverter = () => {
  const config = sidebarConfig[2]?.items?.[0]?.children?.find(item => item.path === "/tiff-converter");
  
  const fallbackConfig = {
    path: "/tiff-converter",
    label: "TIFF Converter",
    title: "Convert TIFF Images - Free Online TIFF Converter",
    description: "Convert TIFF images to PNG, JPEG, WebP, GIF, BMP and other formats. Free online TIFF converter with high quality output.",
    keywords: "tiff converter, convert tiff, tiff to png, tiff to jpeg, tiff to webp",
    canonical: "https://getyovids.com/image-converter/tiff"
  };
  
  const finalConfig = config || fallbackConfig;

  return (
    <ConverterPage 
      config={finalConfig}
      supportedInputFormats={["TIFF", "TIF"]}
      supportedOutputFormats={["PNG", "JPEG", "JPG", "WEBP", "GIF", "BMP", "TGA", "ICO"]}
      acceptedFileTypes="image/tiff,.tiff,.tif"
      maxFileSize="25MB"
    />
  );
};

export default TiffConverter; 