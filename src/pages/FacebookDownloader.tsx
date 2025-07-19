import React from "react";
import { ToolPage } from "../components/ToolPage";
import { sidebarConfig } from "../config/sidebarConfig";

const FacebookDownloader = () => {
  const config = sidebarConfig[0].items.find(item => item.path === "/facebook-downloader")!;
  
  return (
    <ToolPage 
      title={config.title}
      description={config.description}
      placeholder="Paste Facebook URL here (e.g., https://www.facebook.com/.../videos/... or https://fb.watch/...)"
      buttonText="Download"
      showFormatOptions={true}
    />
  );
};

export default FacebookDownloader;
