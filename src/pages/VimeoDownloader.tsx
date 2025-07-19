import React from "react";
import { ToolPage } from "../components/ToolPage";
import { sidebarConfig } from "../config/sidebarConfig";

const VimeoDownloader = () => {
  const config = sidebarConfig[0].items.find(item => item.path === "/vimeo-downloader")!;
  
  return (
    <ToolPage 
      title={config.title}
      description={config.description}
      placeholder="Paste Vimeo URL here (e.g., https://vimeo.com/...)"
      buttonText="Download"
      showFormatOptions={true}
    />
  );
};

export default VimeoDownloader;
