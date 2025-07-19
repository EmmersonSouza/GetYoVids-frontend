import React from "react";
import { ToolPage } from "../components/ToolPage";
import { sidebarConfig } from "../config/sidebarConfig";

const XhamsterDownloader = () => {
  const config = sidebarConfig[1].items.find(item => item.path === "/xhamster-downloader")!;
  
  return (
    <ToolPage 
      title={config.title}
      description={config.description}
      placeholder="Paste Xhamster URL here (e.g., https://xhamster.com/videos/...)"
      buttonText="Download"
      showFormatOptions={true}
    />
  );
};

export default XhamsterDownloader;
