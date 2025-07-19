
import ConverterPage from "../components/ConverterPage";
import { sidebarConfig } from "../config/sidebarConfig";

const Mp4ToMp3 = () => {
  const config = sidebarConfig[1].items.find(item => item.path === "/mp4-to-mp3")!;
  
  return (
    <ConverterPage 
      config={config}
      supportedInputFormats={["MP4"]}
      supportedOutputFormats={["MP3"]}
      acceptedFileTypes="video/mp4"
      maxFileSize="200MB" // MP4 files can be larger
    />
  );
};

export default Mp4ToMp3;
