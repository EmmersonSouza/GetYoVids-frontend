import React from "react";
import { ToolPage } from "../components/ToolPage";
import { sidebarConfig } from "../config/sidebarConfig";

const RedditDownloader = () => {
  const config = sidebarConfig[0].items.find(item => item.path === "/reddit-downloader")!;
  
  return (
    <ToolPage 
      title={config.title}
      description={config.description}
      placeholder="Paste Reddit URL here (e.g., https://www.reddit.com/r/.../comments/...)"
      buttonText="Download"
      showFormatOptions={true}
    />
  );
};

export default RedditDownloader;
