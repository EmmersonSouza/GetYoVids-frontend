import { ToolPage } from "../components/ToolPage";
import { sidebarConfig } from "../config/sidebarConfig";

const TikTokDownloader = () => {
  const config = sidebarConfig[0].items.find(item => item.path === "/tiktok-downloader")!;
  
  return (
    <ToolPage 
      title={config.title}
      description={config.description}
      placeholder="Paste TikTok URL here (e.g., https://www.tiktok.com/@user/video/...)"
      buttonText="Download"
      showFormatOptions={true}
    />
  );
};

export default TikTokDownloader;
