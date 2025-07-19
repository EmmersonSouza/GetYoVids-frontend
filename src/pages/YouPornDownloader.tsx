import React from "react";
import { ToolPage } from "../components/ToolPage";
import { sidebarConfig } from "../config/sidebarConfig";

const YouPornDownloader = () => {
  const config = sidebarConfig[1].items.find(item => item.path === "/youporn-downloader")!;
  
  return (
    <ToolPage 
      title={config.title}
      description={config.description}
      placeholder="Paste YouPorn URL here (e.g., https://www.youporn.com/watch/...)"
      buttonText="Download"
      showFormatOptions={true}
    />
  );
};

export default YouPornDownloader;
