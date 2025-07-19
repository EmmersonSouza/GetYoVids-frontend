import ConverterPage from "../components/ConverterPage";
import { sidebarConfig } from "../config/sidebarConfig";

const AviConverter = () => {
  const config = sidebarConfig[2].items[1].children?.find(item => item.path === "/avi-converter");
  
  if (!config) {
    return <div>Configuration for AVI Converter not found.</div>;
  }

  return (
    <ConverterPage 
      config={config}
      supportedInputFormats={["AVI"]}
      supportedOutputFormats={["MP4", "MKV", "MOV", "WEBM", "WMV", "FLV", "3GP", "M4V"]}
      acceptedFileTypes="video/x-msvideo,.avi"
      maxFileSize="200MB"
    />
  );
};

export default AviConverter; 