import React from "react";
import { ToolPage } from "../components/ToolPage";
import { sidebarConfig } from "../config/sidebarConfig";

const PornhubDownloader = () => {
  // Note: Using index 1 for adult video downloaders section in sidebarConfig
  const config = sidebarConfig[1].items.find(item => item.path === "/pornhub-downloader")!;
  
  return (
    <ToolPage 
      title={config.title}
      description={config.description}
      placeholder="Paste Pornhub URL here (e.g., https://www.pornhub.com/view_video.php?viewkey=...)"
      buttonText="Download"
      showFormatOptions={true}
    />
  );
};

export default PornhubDownloader;
