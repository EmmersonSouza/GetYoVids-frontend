import ConverterPage from "../components/ConverterPage";
import { sidebarConfig } from "../config/sidebarConfig";

const Mp3Converter = () => {
  const config = sidebarConfig[2].items[2].children?.find(item => item.path === "/mp3-converter");
  
  if (!config) {
    return <div>Configuration for MP3 Converter not found.</div>;
  }

  return (
    <ConverterPage 
      config={config}
      supportedInputFormats={["MP3"]}
      supportedOutputFormats={["WAV", "AAC", "FLAC", "OGG", "M4A", "WMA", "AIFF", "AMR"]}
      acceptedFileTypes="audio/mpeg,.mp3"
      maxFileSize="200MB"
    />
  );
};

export default Mp3Converter; 