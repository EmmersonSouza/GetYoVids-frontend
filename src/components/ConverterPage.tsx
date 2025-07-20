import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { downloadService } from "@/services/api";
import { getApi } from "@/services/api";
import { X, Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { SidebarItem } from "@/config/sidebarConfig";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdSpace from "./AdSpace";
import { MonetizedButton } from "./MonetizedButton";
import { MonetizationInfo } from "./MonetizationInfo";

interface ConverterPageProps {
  config: SidebarItem;
  supportedInputFormats: string[];
  supportedOutputFormats: string[];
  acceptedFileTypes: string;
  maxFileSize: string;
}

interface ConversionItem {
  id: string;
  file: File;
  status: "converting" | "completed" | "failed";
  progress: number;
  outputUrl?: string;
  error?: string;
  downloadName?: string;
}

const ConverterPage = ({
  config,
  supportedInputFormats,
  supportedOutputFormats,
  acceptedFileTypes,
  maxFileSize
}: ConverterPageProps) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>(supportedOutputFormats[0]);
  const [conversions, setConversions] = useState<ConversionItem[]>([]);
  const [isConverting, setIsConverting] = useState(false);



  // Remove a file from the selection
  const handleRemoveFile = (index: number) => {
    if (!files) return;

    const dt = new DataTransfer();
    for (let i = 0; i < files.length; i++) {
      if (i !== index) dt.items.add(files[i]);
    }
    setFiles(dt.files);
  };

  // Handle format selection
  const handleFormatChange = (format: string) => {
    setSelectedFormat(format);
  };

  // Remove a conversion from the list
  const removeConversion = (id: string) => {
    setConversions(prev => prev.filter(item => item.id !== id));
  };

  // Convert files to selected format
  const handleConvert = async () => {
    if (!files || files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to convert.",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    
    // Pre-validate all files and create conversion items
    const validFiles: Array<{ file: File; conversionId: string }> = [];
    const maxSizeInMB = parseFloat(maxFileSize.replace("MB", "").replace("GB", "").replace("KB", ""));
    const maxSizeInBytes = maxFileSize.includes("GB") ? maxSizeInMB * 1024 * 1024 * 1024 : 
                          maxSizeInMB * 1024 * 1024;
    
    // First pass: validate files and create conversion items
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.size > maxSizeInBytes) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the maximum file size of ${maxFileSize}.`,
          variant: "destructive",
        });
        continue;
      }
      
      // Create a unique ID for this conversion
      const conversionId = Math.random().toString(36).substring(2, 15);
      validFiles.push({ file, conversionId });
      
      // Add to conversions list immediately
      const newConversion: ConversionItem = {
        id: conversionId,
        file,
        status: "converting",
        progress: 0,
      };
      setConversions(prev => [...prev, newConversion]);
    }

    if (validFiles.length === 0) {
      setIsConverting(false);
      toast({
        title: "No valid files",
        description: "All selected files were invalid or too large.",
        variant: "destructive",
      });
      return;
    }

    // Process files in parallel
    const conversionPromises = validFiles.map(async ({ file, conversionId }) => {
      try {
        // Determine the correct backend endpoint based on file type
        let endpoint = "/convert/video"; // default
        if (file.type.startsWith("image/")) {
          endpoint = "/convert/image";
        } else if (file.type.startsWith("audio/")) {
          endpoint = "/convert/audio-general";
        } else if (file.type.startsWith("video/")) {
          endpoint = "/convert/video";
        } else {
          // Try to determine by file extension
          const extension = file.name.split('.').pop()?.toLowerCase();
          if (extension && ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff', 'tga', 'exr', 'heif', 'heic', 'ico', 'psd'].includes(extension)) {
            endpoint = "/convert/image";
          } else if (extension && ['mp3', 'wav', 'aac', 'flac', 'ogg', 'm4a', 'wma', 'aiff', 'amr'].includes(extension)) {
            endpoint = "/convert/audio-general";
          } else if (extension && ['mp4', 'avi', 'mov', 'webm', 'mkv', 'wmv', 'flv', '3gp', 'm4v'].includes(extension)) {
            endpoint = "/convert/video";
          }
        }

        // Create form data with correct field names
        const formData = new FormData();
        formData.append("InputFile", file); // Backend expects "InputFile"
        formData.append("OutputFormat", selectedFormat.toLowerCase()); // Backend expects "OutputFormat"
        formData.append("Quality", "high");

        // Send to API with correct endpoint
        const api = await getApi();
        const response = await api.post(endpoint, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setConversions(prev =>
                prev.map(item =>
                  item.id === conversionId
                    ? { ...item, progress: percentCompleted }
                    : item
                )
              );
            }
          },
          responseType: "blob", // All conversion endpoints return files directly as blobs
        });

        // All conversion endpoints return the file directly as a blob
        const blob = response.data;
        const downloadUrl = URL.createObjectURL(blob);
        const fileName = `${file.name.split(".")[0]}.${selectedFormat.toLowerCase()}`;
        
        setConversions(prev =>
          prev.map(item =>
            item.id === conversionId
              ? { 
                  ...item, 
                  status: "completed",
                  outputUrl: downloadUrl,
                  downloadName: fileName,
                }
              : item
          )
        );

        return { success: true, fileName: file.name };
      } catch (error: any) {
        console.error("Conversion error:", error);
        
        // Extract meaningful error message
        let errorMessage = "An unknown error occurred";
        if (error.response?.data?.Error) {
          errorMessage = error.response.data.Error;
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setConversions(prev =>
          prev.map(item =>
            item.id === conversionId
              ? { 
                  ...item, 
                  status: "failed", 
                  error: errorMessage
                }
              : item
          )
        );

        return { success: false, fileName: file.name, error: errorMessage };
      }
    });

    // Wait for all conversions to complete
    try {
      const results = await Promise.allSettled(conversionPromises);
      
      // Count successful and failed conversions
      let successCount = 0;
      let failedCount = 0;
      
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          if (result.value.success) {
            successCount++;
          } else {
            failedCount++;
          }
        } else {
          failedCount++;
        }
      });

      // Show batch completion toast
      if (successCount > 0 && failedCount === 0) {
        toast({
          title: "Batch conversion completed",
          description: `Successfully converted ${successCount} ${successCount === 1 ? 'file' : 'files'}.`,
        });
      } else if (successCount > 0 && failedCount > 0) {
        toast({
          title: "Batch conversion completed with errors",
          description: `${successCount} files converted successfully, ${failedCount} failed.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Batch conversion failed",
          description: `All ${failedCount} files failed to convert.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Batch conversion error:", error);
      toast({
        title: "Batch conversion error",
        description: "An unexpected error occurred during batch conversion.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
      setFiles(null);
    }
  };

  // Handle file download
  const handleDownload = (item: ConversionItem) => {
    if (item.outputUrl) {
      const link = document.createElement("a");
      link.href = item.outputUrl;
      link.download = item.downloadName || `converted-file.${selectedFormat.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <Helmet>
        <title>{config.title}</title>
        <meta name="description" content={config.description} />
      </Helmet>
      <div className="flex-1 bg-background text-foreground p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              {config.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {config.description}
            </p>
          </div>
          
          {/* Top Horizontal Ad Space */}
          <div className="mb-8">
            <AdSpace type="horizontal" size="728x90" />
          </div>

        <div className="bg-card rounded-lg border border-gray-800 p-6 mb-8">
          <div className="space-y-4">
            <div>
              <Label htmlFor="format">Output Format</Label>
              <Select value={selectedFormat} onValueChange={handleFormatChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {supportedOutputFormats.map((format) => (
                    <SelectItem key={format} value={format}>
                      {format}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="file-upload">Upload Files</Label>
              <FileUpload
                acceptedFileTypes={acceptedFileTypes}
                maxFileSize={maxFileSize}
                supportedFormats={supportedInputFormats}
                onFilesSelected={setFiles}
                files={files}
                onRemoveFile={handleRemoveFile}
                multiple={true}
                disabled={isConverting}
              />
            </div>

            {/* Monetization Info */}
            <MonetizationInfo 
              platformType="regular"
              isConversion={true}
            />

            <MonetizedButton
              platformType="regular"
              isConversion={true}
              originalText="Convert Files"
              onClick={handleConvert}
              disabled={!files || files.length === 0 || isConverting}
              loading={isConverting}
              className="w-full"
            />
          </div>
        </div>

        {conversions.length > 0 && (
          <div className="bg-card rounded-lg border border-gray-800 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                Conversion Queue ({conversions.length})
              </h2>
              <div className="flex items-center gap-2">
                {conversions.some(item => item.status === "completed") && (
                  <MonetizedButton
                    platformType="regular"
                    isConversion={true}
                    originalText={`Download All (${conversions.filter(item => item.status === "completed").length})`}
                    onClick={() => {
                      conversions
                        .filter(item => item.status === "completed")
                        .forEach(item => handleDownload(item));
                    }}
                    size="sm"
                    variant="outline"
                    className="bg-green-500/10 hover:bg-green-500/20 border-green-500/20"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download All ({conversions.filter(item => item.status === "completed").length})
                  </MonetizedButton>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setConversions([])}
                  className="bg-red-500/10 hover:bg-red-500/20 border-red-500/20"
                >
                  Clear Queue
                </Button>
              </div>
            </div>
            
            {/* Overall Progress */}
            {conversions.some(item => item.status === "converting") && (
              <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-400">
                    Processing {conversions.filter(item => item.status === "converting").length} files...
                  </span>
                  <span className="text-sm text-blue-400">
                    {conversions.filter(item => item.status === "completed").length} / {conversions.length} completed
                  </span>
                </div>
                <Progress 
                  value={(conversions.filter(item => item.status === "completed").length / conversions.length) * 100} 
                  className="h-2"
                />
              </div>
            )}
            
            <div className="space-y-4">
              {/* Conversions Ad Space */}
              <div className="mb-4">
                <AdSpace type="horizontal" size="300x250" />
              </div>
              
              {conversions.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border ${
                    item.status === "completed"
                      ? "border-green-500/20 bg-green-500/5"
                      : item.status === "failed"
                        ? "border-red-500/20 bg-red-500/5"
                        : "border-gray-700 bg-gray-800/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-grow">
                      <p className="text-white font-medium">{item.file.name.split('.').slice(0, -1).join('.') || item.file.name}</p>
                      <p className="text-sm text-gray-400">
                        {item.status === "converting" && "Processing..."}
                        {item.status === "completed" && "Ready to download"}
                        {item.status === "failed" && `Failed: ${item.error}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.status === "completed" && (
                        <MonetizedButton
                          platformType="regular"
                          isConversion={true}
                          originalText="Download"
                          onClick={() => handleDownload(item)}
                          size="sm"
                          variant="outline"
                          className="bg-primary/10 hover:bg-primary/20"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </MonetizedButton>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => removeConversion(item.id)}>
                        <X size={16} />
                      </Button>
                    </div>
                  </div>
                  {item.status === "converting" && item.progress > 0 && (
                    <div className="mt-2">
                      <Progress value={item.progress} className="h-1" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Middle Horizontal Ad Space */}
        <div className="mb-8">
          <AdSpace type="horizontal" size="970x90" />
        </div>
        
        {/* Bottom Horizontal Ad Space */}
        <div className="mb-8">
          <AdSpace type="horizontal" size="728x90" />
        </div>

        {/* SEO Content */}
        <div className="bg-card rounded-lg border border-gray-800 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            How To Use This {config.label}
          </h2>
          <div className="text-gray-300 space-y-4">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">📁 Step-by-Step Guide</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li><strong>Upload Your Files:</strong> Click "Choose Files" and select the {supportedInputFormats.join(' or ')} files you want to convert.</li>
                <li><strong>Select Output Format:</strong> Choose your desired output format from the dropdown menu.</li>
                <li><strong>Start Conversion:</strong> Click "Convert Files" to begin processing your uploads.</li>
                <li><strong>Download Results:</strong> Once converted, click the download button for each file in your conversion queue.</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-2">🎯 Supported Formats</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-green-400">Input Formats</h4>
                  <p className="text-sm">{supportedInputFormats.join(', ')}</p>
                </div>
                <div>
                  <h4 className="font-medium text-blue-400">Output Formats</h4>
                  <p className="text-sm">{supportedOutputFormats.join(', ')}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="font-medium text-blue-400 mb-2">💡 Pro Tips</h4>
              <ul className="text-sm space-y-1 list-disc list-inside ml-4">
                <li>Multiple files can be converted simultaneously</li>
                <li>Conversions preserve original quality when possible</li>
                <li>Files are processed securely and deleted after download</li>
                <li>Maximum file size: {maxFileSize}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ConverterPage;
