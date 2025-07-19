import ConverterPage from "../components/ConverterPage";
import { sidebarConfig } from "../config/sidebarConfig";
import BannerAd from "../components/BannerAd";

const GifConverter = () => {
  const config = sidebarConfig[2]?.items?.[0]?.children?.find(item => item.path === "/gif-converter");
  
  const fallbackConfig = {
    path: "/gif-converter",
    label: "GIF Converter",
    title: "Convert GIF Images - Free Online GIF Converter",
    description: "Convert GIF images to PNG, JPEG, WebP, BMP, TIFF and other formats. Free online GIF converter with high quality output.",
    keywords: "gif converter, convert gif, gif to png, gif to jpeg, gif to webp",
    canonical: "https://getyovids.com/image-converter/gif"
  };
  
  const finalConfig = config || fallbackConfig;

  return (
    <>
      <ConverterPage 
        config={finalConfig}
        supportedInputFormats={["GIF"]}
        supportedOutputFormats={["PNG", "JPEG", "JPG", "WEBP", "BMP", "TIFF", "TGA", "ICO"]}
        acceptedFileTypes="image/gif,.gif"
        maxFileSize="50MB"
      />
      <BannerAd />

      {/* Additional Banner Ad */}
      <BannerAd />
    </>
  );
};

export default GifConverter; 