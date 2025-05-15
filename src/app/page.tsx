'use client'

import { useState, useEffect } from "react";
import { FileList } from "@/components/FileList";
import { VideoPlayer } from "@/components/VideoPlayer";

type VideoFile = {
  name: string;
  duration: number;
  createdAt?: string;
  author?: string;
  fileUrl: string;
  size: number; // 文件大小
  format: string; // 文件格式
  thumbnailUrl: string; // 预览图 URL
};

export default function Home() {
  const [videoFiles, setVideoFiles] = useState<VideoFile[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLooping, setIsLooping] = useState(false);

  useEffect(() => {
    let videoElement: HTMLVideoElement | null = null;

    if (isLooping && videoFiles.length > 0) {
      let currentIndex = videoFiles.findIndex(
        (video) => video.fileUrl === selectedVideo?.fileUrl
      );

      const handleVideoEnd = () => {
        currentIndex = (currentIndex + 1) % videoFiles.length;
        setSelectedVideo(videoFiles[currentIndex]);
      };

      videoElement = document.querySelector("video");
      if (videoElement) {
        videoElement.addEventListener("ended", handleVideoEnd);
      }

      return () => {
        if (videoElement) {
          videoElement.removeEventListener("ended", handleVideoEnd);
        }
      };
    }
  }, [isLooping, videoFiles, selectedVideo]);

  const handleDirectoryPicker = async () => {
    try {
      if (!window.showDirectoryPicker) {
        alert("您的浏览器不支持文件夹选择功能！");
        return;
      }

      setLoading(true);
      const dirHandle = await window.showDirectoryPicker();
      const files: VideoFile[] = [];

      async function traverseDirectory(dirHandle: FileSystemDirectoryHandle) {
        for await (const entry of dirHandle.values()) {
          if (entry.kind === "file" && entry.name.match(/\.(mp4|mkv|avi|mov|webm)$/i)) {
            const file = await (entry as FileSystemFileHandle).getFile();
            const blobUrl = URL.createObjectURL(file);
            const createdAt = file.lastModified
              ? new Date(file.lastModified).toLocaleString()
              : "未知";
            const author = "未知作者"; // 这里可以自定义作者来源
            const format = file.name.split(".").pop()?.toUpperCase() || "未知";
            const size = file.size; // 文件大小（字节）

            // 获取视频第一帧作为预览图
            const thumbnailUrl = await generateThumbnail(blobUrl);

            // 使用 <video> 元素获取视频时长
            await new Promise<void>((resolve) => {
              const video = document.createElement("video");
              video.src = blobUrl;
              video.addEventListener("loadedmetadata", () => {
                files.push({
                  name: file.name,
                  duration: video.duration,
                  createdAt,
                  author,
                  fileUrl: blobUrl,
                  size,
                  format,
                  thumbnailUrl,
                });
                resolve();
              });
            });
          } else if (entry.kind === "directory") {
            await traverseDirectory(entry as FileSystemDirectoryHandle);
          }
        }
      }

      await traverseDirectory(dirHandle);
      setVideoFiles(files);
    } catch (error) {
      console.error("Error reading directory:", error);
      alert("读取目录时发生错误！");
    } finally {
      setLoading(false);
    }
  };

  const generateThumbnail = (videoUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.src = videoUrl;
      video.currentTime = 1; // 跳到视频的第 1 秒
      video.addEventListener("loadeddata", () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth / 2; // 缩小预览图尺寸
        canvas.height = video.videoHeight / 2;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg")); // 返回第一帧的 Base64 图片
      });
    });
  };

  const handleLoopVideos = () => {
    setIsLooping((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* 左侧视频文件列表 */}
      <aside className="w-1/4 bg-white shadow-lg p-4 overflow-y-auto">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          视频文件列表（总计：{videoFiles.length} 个）
        </h2>
        <button
          onClick={handleDirectoryPicker}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none w-full mb-4"
          disabled={loading}
        >
          {loading ? "处理中..." : "选择文件夹"}
        </button>
        <button
          onClick={handleLoopVideos}
          className={`${
            isLooping ? "bg-red-500" : "bg-green-500"
          } text-white px-4 py-2 rounded hover:bg-opacity-80 focus:outline-none w-full mb-4`}
        >
          {isLooping ? "停止循环播放" : "循环播放所有视频"}
        </button>
        <FileList
          videoFiles={videoFiles}
          onSelectVideo={(video) => setSelectedVideo(video as VideoFile)}
        />
      </aside>

      {/* 中间视频播放器 */}
      <main className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        {selectedVideo ? (
          <VideoPlayer video={selectedVideo} />
        ) : (
          <p className="text-gray-500">请选择一个视频文件进行播放。</p>
        )}
      </main>
    </div>
  );
}