import React from "react";
import { ToolPage } from "../components/ToolPage";
import { sidebarConfig } from "../config/sidebarConfig";

const XvideosDownloader = () => {
  const config = sidebarConfig[1].items.find(item => item.path === "/xvideos-downloader")!;
  
  return (
    <ToolPage 
      title={config.title}
      description={config.description}
      placeholder="Paste Xvideos URL here (e.g., https://www.xvideos.com/video...)"
      buttonText="Download"
      showFormatOptions={true}
    />
  );
};

export default XvideosDownloader;
