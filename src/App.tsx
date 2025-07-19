import React from "react";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import YoutubeDownloader from "./pages/YoutubeDownloader";
import TikTokDownloader from "./pages/TikTokDownloader";
import PornhubDownloader from "./pages/PornhubDownloader";
import XvideosDownloader from "./pages/XvideosDownloader";
import XhamsterDownloader from "./pages/XhamsterDownloader";
import RedGifsDownloader from "./pages/RedGifsDownloader";
import YouPornDownloader from "./pages/YouPornDownloader";
import SpankBangDownloader from "./pages/SpankBangDownloader";
import InstagramDownloader from "./pages/InstagramDownloader";
import TwitterDownloader from "./pages/TwitterDownloader";
import VimeoDownloader from "./pages/VimeoDownloader";
import FacebookDownloader from "./pages/FacebookDownloader";
import TwitchDownloader from "./pages/TwitchDownloader";
import RedditDownloader from "./pages/RedditDownloader";
import PngConverter from "./pages/PngConverter";
import JpegConverter from "./pages/JpegConverter";
import WebpConverter from "./pages/WebpConverter";
import GifConverter from "./pages/GifConverter";
import BmpConverter from "./pages/BmpConverter";
import TiffConverter from "./pages/TiffConverter";
import TgaConverter from "./pages/TgaConverter";
import ExrConverter from "./pages/ExrConverter";
import HeifConverter from "./pages/HeifConverter";
import IcoConverter from "./pages/IcoConverter";
import PsdConverter from "./pages/PsdConverter";
import Mp4Converter from "./pages/Mp4Converter";
import AviConverter from "./pages/AviConverter";
import MovConverter from "./pages/MovConverter";
import WebmConverter from "./pages/WebmConverter";
import MkvConverter from "./pages/MkvConverter";
import Mp3Converter from "./pages/Mp3Converter";
import WavConverter from "./pages/WavConverter";
import FlacConverter from "./pages/FlacConverter";
import AacConverter from "./pages/AacConverter";
import OggConverter from "./pages/OggConverter";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/youtube-downloader" element={<YoutubeDownloader />} />
              <Route path="/tiktok-downloader" element={<TikTokDownloader />} />
              <Route path="/pornhub-downloader" element={<PornhubDownloader />} />
              <Route path="/xvideos-downloader" element={<XvideosDownloader />} />
              <Route path="/xhamster-downloader" element={<XhamsterDownloader />} />
              <Route path="/redgifs-downloader" element={<RedGifsDownloader />} />
              <Route path="/youporn-downloader" element={<YouPornDownloader />} />
              <Route path="/spankbang-downloader" element={<SpankBangDownloader />} />
              <Route path="/instagram-downloader" element={<InstagramDownloader />} />
              <Route path="/twitter-downloader" element={<TwitterDownloader />} />
              <Route path="/vimeo-downloader" element={<VimeoDownloader />} />
              <Route path="/facebook-downloader" element={<FacebookDownloader />} />
              <Route path="/twitch-downloader" element={<TwitchDownloader />} />
              <Route path="/reddit-downloader" element={<RedditDownloader />} />
              <Route path="/png-converter" element={<PngConverter />} />
              <Route path="/jpeg-converter" element={<JpegConverter />} />
              <Route path="/webp-converter" element={<WebpConverter />} />
              <Route path="/gif-converter" element={<GifConverter />} />
              <Route path="/bmp-converter" element={<BmpConverter />} />
              <Route path="/tiff-converter" element={<TiffConverter />} />
              <Route path="/tga-converter" element={<TgaConverter />} />
              <Route path="/exr-converter" element={<ExrConverter />} />
              <Route path="/heif-converter" element={<HeifConverter />} />
              <Route path="/ico-converter" element={<IcoConverter />} />
              <Route path="/psd-converter" element={<PsdConverter />} />
              <Route path="/mp4-converter" element={<Mp4Converter />} />
              <Route path="/avi-converter" element={<AviConverter />} />
              <Route path="/mov-converter" element={<MovConverter />} />
              <Route path="/webm-converter" element={<WebmConverter />} />
              <Route path="/mkv-converter" element={<MkvConverter />} />
              <Route path="/mp3-converter" element={<Mp3Converter />} />
              <Route path="/wav-converter" element={<WavConverter />} />
              <Route path="/flac-converter" element={<FlacConverter />} />
              <Route path="/aac-converter" element={<AacConverter />} />
              <Route path="/ogg-converter" element={<OggConverter />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
