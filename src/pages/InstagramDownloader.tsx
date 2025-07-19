import React from "react";
import { ToolPage } from "../components/ToolPage";
import { sidebarConfig } from "../config/sidebarConfig";

const InstagramDownloader = () => {
  const config = sidebarConfig[0].items.find(item => item.path === "/instagram-downloader")!;
  
  return (
    <ToolPage 
      title={config.title}
      description={config.description}
      placeholder="Paste Instagram URL here (e.g., https://www.instagram.com/p/... or https://www.instagram.com/reel/...)"
      buttonText="Download"
      showFormatOptions={true}
    />
  );
};

export default InstagramDownloader;
