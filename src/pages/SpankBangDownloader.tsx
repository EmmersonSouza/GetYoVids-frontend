import React from "react";
import { ToolPage } from "../components/ToolPage";
import { sidebarConfig } from "../config/sidebarConfig";

const SpankBangDownloader = () => {
  const config = sidebarConfig[1].items.find(item => item.path === "/spankbang-downloader")!;
  
  return (
    <ToolPage 
      title={config.title}
      description={config.description}
      placeholder="Paste SpankBang URL here (e.g., https://www.spankbang.com/...)"
      buttonText="Download"
      showFormatOptions={true}
    />
  );
};

export default SpankBangDownloader;
