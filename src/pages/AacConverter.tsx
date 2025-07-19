import ConverterPage from "../components/ConverterPage";
import { sidebarConfig } from "../config/sidebarConfig";

const AacConverter = () => {
  const config = sidebarConfig[2].items[2].children?.find(item => item.path === "/aac-converter");
  
  if (!config) {
    return <div>Configuration for AAC Converter not found.</div>;
  }

  return (
    <ConverterPage 
      config={config}
      supportedInputFormats={["AAC"]}
      supportedOutputFormats={["MP3", "WAV", "FLAC", "OGG", "M4A", "WMA", "AIFF", "AMR"]}
      acceptedFileTypes="audio/aac,.aac"
      maxFileSize="200MB"
    />
  );
};

export default AacConverter; 