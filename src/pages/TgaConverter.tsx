import ConverterPage from "../components/ConverterPage";
import { sidebarConfig } from "../config/sidebarConfig";

const TgaConverter = () => {
  const config = sidebarConfig[2]?.items?.[0]?.children?.find(item => item.path === "/tga-converter");
  
  const fallbackConfig = {
    path: "/tga-converter",
    label: "TGA Converter",
    title: "Convert TGA Images - Free Online TGA Converter",
    description: "Convert TGA images to PNG, JPEG, WebP, GIF, BMP, TIFF and other formats. Free online TGA converter with high quality output.",
    keywords: "tga converter, convert tga, tga to png, tga to jpeg, tga to webp",
    canonical: "https://getyovids.com/image-converter/tga"
  };
  
  const finalConfig = config || fallbackConfig;

  return (
    <ConverterPage 
      config={finalConfig}
      supportedInputFormats={["TGA"]}
      supportedOutputFormats={["PNG", "JPEG", "JPG", "WEBP", "GIF", "BMP", "TIFF", "ICO"]}
      acceptedFileTypes="image/x-tga,.tga"
      maxFileSize="50MB"
    />
  );
};

export default TgaConverter; 