
import { NavLink } from "react-router-dom";
import { X, Download, Music, Headphones, ChevronDown, Image, FileVideo, FileAudio } from "lucide-react";
import { sidebarConfig } from "../config/sidebarConfig";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SidebarProps {
  onClose: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const getIcon = (iconName: string | undefined) => {
    switch (iconName) {
      case "Download":
        return <Download size={20} />;
      case "Music":
        return <Music size={20} />;
      case "Headphones":
        return <Headphones size={20} />;
      case "image":
        return <Image size={20} />;
      case "file-video":
        return <FileVideo size={20} />;
      case "file-audio":
        return <FileAudio size={20} />;
      default:
        return <Download size={20} />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Download className="text-primary" size={24} />
          <span className="text-white font-bold text-lg">GetYoVids</span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation with Accordion */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <Accordion type="multiple" defaultValue={["item-0", "item-1", "item-2"]} className="space-y-2">
          {sidebarConfig.map((section, sectionIndex) => (
            <AccordionItem 
              key={section.title} 
              value={`item-${sectionIndex}`}
              className="border-gray-800"
            >
              <AccordionTrigger className="text-gray-300 hover:text-white hover:no-underline py-3 px-2">
                <span className="text-sm font-medium">{section.title}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-2">
                <div className="space-y-1 pl-2">
                  {section.items.map((item, itemIndex) => (
                    item.children ? (
                      <Accordion key={`${sectionIndex}-${itemIndex}`} type="single" collapsible className="w-full">
                        <AccordionItem value={item.label} className="border-none">
                          <AccordionTrigger className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm text-gray-300 hover:bg-gray-800 hover:text-white hover:no-underline">
                            {item.icon && getIcon(item.icon)}
                            <span className="font-medium">{item.label}</span>
                          </AccordionTrigger>
                          <AccordionContent className="pb-1">
                            <div className="space-y-1 pl-6">
                              {item.children.map((child) => (
                                <NavLink
                                  key={child.path}
                                  to={child.path!}
                                  onClick={onClose}
                                  className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm ${
                                      isActive
                                        ? "bg-primary text-white"
                                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                    }`
                                  }
                                >
                                  {child.icon && getIcon(child.icon)}
                                  <span className="font-medium">{child.label}</span>
                                </NavLink>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ) : (
                      <NavLink
                        key={item.path}
                        to={item.path!}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm ${
                            isActive
                              ? "bg-primary text-white"
                              : "text-gray-300 hover:bg-gray-800 hover:text-white"
                          }`
                        }
                      >
                        {item.icon && getIcon(item.icon)}
                        <span className="font-medium">{item.label}</span>
                      </NavLink>
                    )
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </nav>
    </div>
  );
};

export default Sidebar;
