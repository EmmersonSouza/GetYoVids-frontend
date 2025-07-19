import ConverterPage from "../components/ConverterPage";
import { sidebarConfig } from "../config/sidebarConfig";

const JpegConverter = () => {
  const config = sidebarConfig[2].items[0].children?.find(item => item.path === "/jpeg-converter");
  
  if (!config) {
    return <div>Configuration for JPEG Converter not found.</div>;
  }

  return (
    <ConverterPage 
      config={config}
      supportedInputFormats={["JPEG", "JPG"]}
      supportedOutputFormats={["PNG", "WEBP", "GIF", "BMP", "TIFF", "TGA", "EXR", "ICO"]}
      acceptedFileTypes="image/jpeg,.jpg,.jpeg"
      maxFileSize="50MB"
    />
  );
};

export default JpegConverter;
