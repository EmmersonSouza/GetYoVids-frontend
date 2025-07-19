import ConverterPage from "../components/ConverterPage";
import { sidebarConfig } from "../config/sidebarConfig";

const FlacConverter = () => {
  const config = sidebarConfig[2].items[2].children?.find(item => item.path === "/flac-converter");
  
  if (!config) {
    return <div>Configuration for FLAC Converter not found.</div>;
  }

  return (
    <ConverterPage 
      config={config}
      supportedInputFormats={["FLAC"]}
      supportedOutputFormats={["WAV", "MP3", "AAC", "OGG", "M4A", "WMA", "AIFF", "AMR"]}
      acceptedFileTypes="audio/flac,.flac"
      maxFileSize="100MB"
    />
  );
};

export default FlacConverter; 