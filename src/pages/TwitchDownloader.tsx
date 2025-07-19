import React from "react";
import { ToolPage } from "../components/ToolPage";
import { sidebarConfig } from "../config/sidebarConfig";

const TwitchDownloader = () => {
  const config = sidebarConfig[0].items.find(item => item.path === "/twitch-downloader")!;
  
  return (
    <ToolPage 
      title={config.title}
      description={config.description}
      placeholder="Paste Twitch URL here (e.g., https://www.twitch.tv/videos/...)"
      buttonText="Download"
      showFormatOptions={true}
    />
  );
};

export default TwitchDownloader;
