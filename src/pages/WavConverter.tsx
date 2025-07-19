import ConverterPage from "../components/ConverterPage";
import { sidebarConfig } from "../config/sidebarConfig";

const WavConverter = () => {
  const config = sidebarConfig[2].items[2].children?.find(item => item.path === "/wav-converter");
  
  if (!config) {
    return <div>Configuration for WAV Converter not found.</div>;
  }

  return (
    <ConverterPage 
      config={config}
      supportedInputFormats={["WAV"]}
      supportedOutputFormats={["MP3", "AAC", "FLAC", "OGG", "M4A", "WMA", "AIFF", "AMR"]}
      acceptedFileTypes="audio/wav,.wav"
      maxFileSize="200MB"
    />
  );
};

export default WavConverter; 