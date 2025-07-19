import ConverterPage from "../components/ConverterPage";
import { sidebarConfig } from "../config/sidebarConfig";

const IcoConverter = () => {
  const config = sidebarConfig[2]?.items?.[0]?.children?.find(item => item.path === "/ico-converter");
  
  const fallbackConfig = {
    path: "/ico-converter",
    label: "ICO Converter",
    title: "Convert ICO Icons - Free Online ICO Converter",
    description: "Convert ICO icon files to PNG, JPEG, WebP, BMP and other formats. Free online ICO converter for Windows icons.",
    keywords: "ico converter, icon converter, convert ico, ico to png, windows icon converter",
    canonical: "https://getyovids.com/image-converter/ico"
  };
  
  const finalConfig = config || fallbackConfig;

  return (
    <ConverterPage 
      config={finalConfig}
      supportedInputFormats={["ICO"]}
      supportedOutputFormats={["PNG", "JPEG", "JPG", "WEBP", "BMP", "TIFF", "GIF"]}
      acceptedFileTypes="image/x-icon,.ico"
      maxFileSize="10MB"
    />
  );
};

export default IcoConverter; 