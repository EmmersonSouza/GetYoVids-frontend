import ConverterPage from "../components/ConverterPage";
import { sidebarConfig } from "../config/sidebarConfig";

const OggConverter = () => {
  const config = sidebarConfig[2].items[2].children?.find(item => item.path === "/ogg-converter");
  
  if (!config) {
    return <div>Configuration for OGG Converter not found.</div>;
  }

  return (
    <ConverterPage 
      config={config}
      supportedInputFormats={["OGG"]}
      supportedOutputFormats={["MP3", "WAV", "AAC", "FLAC", "M4A", "WMA", "AIFF", "AMR"]}
      acceptedFileTypes="audio/ogg,.ogg"
      maxFileSize="200MB"
    />
  );
};

export default OggConverter; 