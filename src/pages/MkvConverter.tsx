import ConverterPage from "../components/ConverterPage";
import { sidebarConfig } from "../config/sidebarConfig";

const MkvConverter = () => {
  const config = sidebarConfig[2]?.items?.[1]?.children?.find(item => item.path === "/mkv-converter");
  
  const fallbackConfig = {
    path: "/mkv-converter",
    label: "MKV Converter", 
    title: "Convert Videos to MKV - Free Online MKV Converter",
    description: "Convert videos to MKV format. Free online MKV converter with high quality output.",
    keywords: "mkv converter, convert to mkv, video to mkv, mp4 to mkv",
    canonical: "https://getyovids.com/video-converter/mkv"
  };
  
  const finalConfig = config || fallbackConfig;

  return (
    <ConverterPage 
      config={finalConfig}
      supportedInputFormats={["MKV"]}
      supportedOutputFormats={["MP4", "AVI", "MOV", "WEBM", "WMV", "FLV", "3GP", "M4V"]}
      acceptedFileTypes="video/x-matroska,.mkv"
      maxFileSize="1GB"
    />
  );
};

export default MkvConverter; 