
import { ToolPage } from "../components/ToolPage";
import { sidebarConfig } from "../config/sidebarConfig";

const AudioExtractor = () => {
  const config = sidebarConfig[2].items.find(item => item.path === "/audio-extractor")!;
  
  return (
    <ToolPage 
      title={config.title}
      description={config.description}
      placeholder="Paste video URL to extract audio..."
      buttonText="Extract"
      showFormatOptions={true}
    />
  );
};

export default AudioExtractor;
