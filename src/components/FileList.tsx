import Image from "next/image";

type FileListProps = {
  videoFiles: {
    name: string;
    duration: number;
    createdAt?: string;
    author?: string;
    fileUrl: string;
    size: number;
    format: string;
    thumbnailUrl: string;
  }[];
  onSelectVideo: (video: unknown) => void;
};

export const FileList = ({ videoFiles, onSelectVideo }: FileListProps) => {
  return (
    <ul className="space-y-4">
      {videoFiles.map((file, index) => (
        <li
          key={index}
          className="p-4 bg-gray-100 rounded-lg shadow cursor-pointer hover:bg-gray-200 transition flex items-center"
          onClick={() => onSelectVideo(file)}
        >
          {/* 视频预览图 */}
          <Image
            src={file.thumbnailUrl}
            alt={file.name}
            width={320}
            height={180}
            className="w-16 h-16 rounded-lg object-cover mr-4"
          />
          {/* 视频信息 */}
          <div className="flex-1">
            <h3 className="text-gray-800 font-semibold">{file.name}</h3>
            <div className="text-sm text-gray-600 mt-2">
              <span className="block">格式: {file.format}</span>
              <span className="block">时长: {file.duration.toFixed(2)} 秒</span>
              <span className="block">
                大小: {(file.size / (1024 * 1024)).toFixed(2)} MB
              </span>
              <span className="block">
                创建时间: {file.createdAt || "未知"}
              </span>
              <span className="block">作者: {file.author || "未知"}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
