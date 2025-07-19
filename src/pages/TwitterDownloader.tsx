import React from "react";
import { ToolPage } from "../components/ToolPage";
import { sidebarConfig } from "../config/sidebarConfig";

const TwitterDownloader = () => {
  const config = sidebarConfig[0].items.find(item => item.path === "/twitter-downloader")!;
  
  return (
    <ToolPage 
      title={config.title}
      description={config.description}
      placeholder="Paste Twitter/X URL here (e.g., https://twitter.com/.../status/... or https://x.com/.../status/...)"
      buttonText="Download"
      showFormatOptions={true}
    />
  );
};

export default TwitterDownloader;
