'use client'

import { useState } from "react";
import { FileList } from "@/components/FileList";
import { VideoPlayer } from "@/components/VideoPlayer";

type VideoFile = {
  name: string;
  duration: number;
  createdAt?: string;
  author?: string;
  fileUrl: string;
};

export default function Home() {
  const [videoFiles, setVideoFiles] = useState<VideoFile[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null);
  const [loading, setLoading] = useState(false);

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
            const fileHandle = entry as FileSystemFileHandle;
            const file = await fileHandle.getFile(); // 调用 getFile() 方法
            const url = URL.createObjectURL(file);
            const createdAt = file.lastModified
              ? new Date(file.lastModified).toLocaleString()
              : "未知";
            const author = file.name.includes("作者") ? "未知作者" : "未知";

            // 使用 <video> 标签获取视频时长
            await new Promise<void>((resolve) => {
              const video = document.createElement("video");
              video.src = url;
              video.addEventListener("loadedmetadata", () => {
                files.push({
                  name: file.name,
                  duration: video.duration,
                  createdAt,
                  author,
                  fileUrl: url,
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

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* 左侧视频文件列表 */}
      <aside className="w-1/4 bg-white shadow-lg p-4 overflow-y-auto">
        <h2 className="text-lg font-bold text-gray-800 mb-4">视频文件列表</h2>
        <button
          onClick={handleDirectoryPicker}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none w-full mb-4"
          disabled={loading}
        >
          {loading ? "处理中..." : "选择文件夹"}
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